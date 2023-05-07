import { GetStaticProps, GetStaticPaths } from "next";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { ImeetupData } from "../../components/interfaces";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";

function MeetupDetails({ meetupData }: { meetupData: ImeetupData }) {
  return (
    <Fragment>
      <Head>
        <title>{meetupData.title}</title>
        <meta name="description" content={meetupData.description}></meta>
      </Head>
      <MeetupDetail
        image={meetupData.image}
        title={meetupData.title}
        address={meetupData.address}
        description={meetupData.description}
      />
    </Fragment>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // connect to "meetupsdb" database, which is indicated in url below too.
  const uri =
    "mongodb+srv://loohongyuan5505:0jzDEpTKugBQKWIH@nextjs-db.9yrmfbe.mongodb.net/meetupsdb?retryWrites=true&w=majority";

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  let allMeetupsIds;

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("meetupsdb").command({ ping: 1 });

    const db = client.db();
    const meetupsCollection = db.collection("meetups");
    allMeetupsIds = await meetupsCollection
      .find({}, { projection: { _id: 1 } })
      .toArray();

    allMeetupsIds = allMeetupsIds.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    }));

    // console.log(allMeetupsIds);
    console.log("featched allMeetupsIds from db, at getStaticPaths");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

  return {
    /*  fallback property
        - false means only all paths listed in paths array is accessible, otherwise return 404Page.
        - true means if new Path not predefined in paths array is used, NextJS would dynamically 
          generate new Page based on that new path.
        - blocking 
     */
    fallback: false,
    paths: allMeetupsIds,
  };
};

export const getStaticProps: GetStaticProps = async function (context) {
  const meetupId = context.params!.meetupId;
  console.log("meetupId at getStaticProps: ", meetupId);

  // connect to "meetupsdb" database, which is indicated in url below too.
  const uri =
    "mongodb+srv://loohongyuan5505:0jzDEpTKugBQKWIH@nextjs-db.9yrmfbe.mongodb.net/meetupsdb?retryWrites=true&w=majority";

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  let selectedMeetup;

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("meetupsdb").command({ ping: 1 });

    const db = client.db();
    const meetupsCollection = db.collection("meetups");

    if (typeof meetupId === "string") {
      selectedMeetup = await meetupsCollection.findOne({
        _id: new ObjectId(meetupId),
      });
    }

    // console.log("selectedMeetup: ", selectedMeetup);
    console.log("fetched selectedMeetup from db, at getStaticProps");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

  return {
    props: {
      meetupData: selectedMeetup && {
        image: selectedMeetup.image,
        id: meetupId,
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
      },
    },
  };
};

export default MeetupDetails;
