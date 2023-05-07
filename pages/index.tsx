// our-domain.com/

import { MongoClient, ServerApiVersion } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";
import { ImeetupData } from "../components/interfaces";
import { GetStaticProps, GetServerSideProps } from "next";
import { Fragment } from "react";
import Head from "next/head";

// for development use only.
// const DUMMY_MEETUPS: ImeetupData[] = [
//   {
//     id: "m1",
//     title: "A First Meetup",
//     image:
//       "https://www.meetup.com/blog/wp-content/uploads/2020/08/holding-hands.jpg",
//     address: "Some address 1, 12356 Some City",
//     description: "this is a first meetup!",
//   },
//   {
//     id: "m2",
//     title: "A Second Meetup",
//     image:
//       "https://etzq49yfnmd.exactdn.com/wp-content/uploads/2022/03/image07-24.png?strip=all&lossy=1&ssl=1",
//     address: "Some address 2, 12356 Some City",
//     description: "this is a second meetup!",
//   },
//   {
//     id: "m3",
//     title: "A Third Meetup",
//     image:
//       "https://www.shutterstock.com/image-vector/people-communicating-speech-bubbles-during-260nw-1917823547.jpg",
//     address: "Some address 3, 12356 Some City",
//     description: "this is a third meetup!",
//   },
// ];

function HomePage(props: { meetups: ImeetupData[] }) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>

        <meta
          name="description"
          content="All meetups collected for NextJS and React Demo project."
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

/** getStaticProps
  - built in NEXTJS feature, mainly used for fetching data, only run on server not in client.
  - can only be used in component resides in "pages" folder
  - this function is executed first, then pass its result as props to HomePage, and finally
    a new page is generated. This process is called SSG(Static Site Generation).
  - if "revalidate: 10" is not configured, SSG only execute once during "npm run build". So
    if new data is available after that, this app has to be rebuild and redeploy.
  - if "revalidate: 10" is configured, new page would automatically be generated after every 10seconds.
    This pre-generated page can serve any request from client very fast. Tips: no. of seconds depends on how frequent your data udpate,
    if frequently use 1s, else XXs.
  - Since data is fetched and compiled into the pre-rendering page. When delivered to client side,
    the data could be seen in static HTML, which is great for Search Engine Optimization crawler
  - getStaticProps is a great replacement for using useEffect and useState to fetch data at client side
  */
export const getStaticProps: GetStaticProps = async () => {
  // e.g. fetch data from API

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

  let allMeetups;

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("meetupsdb").command({ ping: 1 });

    const db = client.db();
    const meetupsCollection = db.collection("meetups");
    allMeetups = await meetupsCollection.find().toArray();

    allMeetups = allMeetups.map((meetup) => ({
      title: meetup.title,
      address: meetup.address,
      image: meetup.image,
      id: meetup._id.toString(),
    }));
    console.log("featched allMeetups data from db, at getStaticProps");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

  return {
    props: {
      meetups: allMeetups,
    },
    revalidate: 10,
  };
};

// for this project, we do not need to use getServerSideProps.
/** getServerSideProps
  - similar to "getStaticProps" except:
    - this function is executed everytime, then new page is regenerate. Which makes it slow.
    - it accepts "context" argument that allow you to have access to request and response objects.
    - no "revalidate" parameter
    */
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const req = context.req;
//   const res = context.res;
//   // e.g. fetch data from API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// };

export default HomePage;
