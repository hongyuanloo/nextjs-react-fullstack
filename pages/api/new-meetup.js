import { MongoClient, ServerApiVersion } from "mongodb";
//  /api/new-meetup

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    const { title, image, address, description } = data;

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

    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("meetupsdb").command({ ping: 1 });

      const db = client.db();

      const meetupsCollection = db.collection("meetups");
      const result = await meetupsCollection.insertOne(data);

      console.log(result);
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }

    res.status(201).json({ message: "Meetup inserted." });
  }
}

export default handler;
