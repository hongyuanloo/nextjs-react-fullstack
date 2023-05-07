// our-domain.com/new-meetup
import NewMeetupForm from "../../components/meetups/NewMeetupForm";
import { ImeetupData } from "../../components/interfaces";
import { useRouter } from "next/router";
import { Fragment } from "react";
import Head from "next/head";

function NewMeetupPage() {
  const router = useRouter();

  async function addMeetupHander(enteredMeetupData: ImeetupData) {
    // console.log(enteredMeetupData);
    const response = await fetch("/api/new-meetup", {
      method: "POST",
      body: JSON.stringify(enteredMeetupData),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    console.log("new data added to db, at addMeetupHander");

    router.push("/");
  }

  return (
    <Fragment>
      <Head>
        <title>Add a new meet up</title>
        <meta name="description" content="new meetup form"></meta>
      </Head>
      <NewMeetupForm onAddMeetup={addMeetupHander}></NewMeetupForm>
    </Fragment>
  );
}

export default NewMeetupPage;
