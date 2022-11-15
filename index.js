const express = require('express');
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

// console.log(process.env.DB_USER, process.env.PASSWORD)

//Mongodb connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.qx4rjdo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//database Connection
if (uri) {
    console.log('Database Connected')
}

//Run function
async function run() {
    const Service = client.db('PhotographyService').collection('services')
    const Reviews = client.db('PhotographyService').collection('reviews')
    const newService = client.db('PhotographyService').collection('newService')
    try {

        // get all Services 
        app.get('/services', async (req, res) => {
            try {
                const cursor = Service.find({})
                const services = await cursor.toArray();

                res.send({
                    success: true,
                    message: 'Successfully read the data!',
                    data: services
                })
            }
            catch (error) {
                console.log(error.message);
                res.send({
                    success: false,
                    error: error.message
                })
            }
        })

        //Read One Service
        app.get('/services/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const service = await Service.findOne({ _id: ObjectId(id) })

                res.send({
                    success: true,
                    message: 'Successfully read the data!',
                    data: service
                })
            }
            catch (error) {
                console.log(error.message);
                res.send({
                    success: false,
                    error: error.message
                })
            }
        })

        //Read added Service
        app.get('/newService', async (req, res) => {
            let query = {};


            try {
                if (req.query.email) {
                    query = {
                        email: req.query.email
                    }
                }
                const cursor = newService.find(query);
                const newservice = await cursor.toArray();
                res.send({
                    success: true,
                    message: 'Successfully read all service',
                    data: newservice
                })
            }
            catch (error) {
                console.log(error.message);
                res.send({
                    success: false,
                    error: error.message
                })
            }

        })

        //Create Reviews
        app.post('/reviews', async (req, res) => {
            const result = await Reviews.insertOne(req.body)
            if (result.insertedId) {
                res.send({
                    success: true,
                    message: 'Succesfully added your Review!!'
                })
            }
            else {
                res.send({
                    success: false,
                    error: 'Your attempt is failed!'
                })
            }
        })
        //Create Services
        app.post('/newService', async (req, res) => {
            const result = await newService.insertOne(req.body)
            if (result.insertedId) {
                res.send({
                    success: true,
                    message: 'Succesfully Booked your Package!!'
                })
            }
            else {
                res.send({
                    success: false,
                    error: 'Your Attempt is failed!'
                })
            }
        })

        //Read all reviews
        app.get('/reviews', async (req, res) => {
            let query = {};


            try {
                if (req.query.email) {
                    query = {
                        email: req.query.email
                    }
                }

                const cursor = Reviews.find(query);
                const reviews = await cursor.toArray();
                res.send({
                    success: true,
                    message: 'Successfully read all reviews',
                    data: reviews
                })
            }
            catch (error) {
                console.log(error.message);
                res.send({
                    success: false,
                    error: error.message
                })
            }

        })

        //Delete Reviews
        app.delete('/reviews/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const reviews = await Reviews.findOne({ _id: ObjectId(id) })

                //Review does not exist
                if (!reviews?._id) {
                    res.send({
                        success: false,
                        error: "No Review",
                    });
                    return;
                }

                //Review Exist
                const result = await Reviews.deleteOne({ _id: ObjectId(id) });

                if (result.deletedCount) {
                    res.send({
                        success: true,
                        message: `Successfully deleted the ${reviews.title}`,
                    });
                }
            }

            catch (error) {
                res.send({
                    success: false,
                    error: error.message,
                });
            }
        })

        //Read each Service reviews
        app.get('/reviews/:id', async (req, res) => {
            const { id } = req.params;
            try {

                const query = { service: id }
                const cursor = Reviews.find(query);
                const single_Review = await cursor.toArray();
                res.send({
                    success: true,
                    message: 'Successfully read all package reviews',
                    data: single_Review
                })
            }
            catch (error) {
                console.log(error.message);
                res.send({
                    success: false,
                    error: error.message
                })
            }

        })

        //Update Review
        //step 1: get the data 
        app.get('/reviews/:id', async (req, res) => {
            try {
                const { id } = (req.params);
                const edit_review = await Reviews.findOne({ _id: ObjectId(id) })
                res.send({
                    success: true,
                    data: edit_review
                })

            }
            catch (error) {
                res.send({
                    success: false,
                    error: error.message
                })
            }
        })

        //Step 2: Update the Data
        app.patch('/reviews/:id', async (req, res) => {
            const { id } = (req.params);
            const options = { upsert: true };
            try {
                const result = await Reviews.updateOne({ _id: ObjectId(id) }, { $set: req.body }, options)
                if (result.matchedCount) {
                    res.send({
                        success: true,
                        message: 'Successfully Updated'
                    })
                }
                else {
                    res.send({
                        success: false,
                        error: 'Could not updated!'
                    })
                }

            }
            catch (error) {
                res.send({
                    success: false,
                    error: error.message
                })
            }
        })



    }

    finally {

    }
}
run().catch(err => console.error(err.message))


app.get('/', (req, res) => {
    res.send('Service Server is running')
})

app.listen(port, (req, res) => {
    console.log('listening to port ', port)
})