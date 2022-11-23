const express = require('express');
const bodyParser = require('body-parser');
const client = require('./db/config')

const app = express();
const  port= 2800;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
let db;

client.connect(function (dbConnectionError, client) {
    if (dbConnectionError) {
        throw dbConnectionError;
    } else {
        db = client.db('APdb'); n
    }
})

app.get('/',(req,res)=>{
    res.send({
        message:'Hello Kishore',
        status : 200
    })
})

app.listen(port, ()=>{
    console.log(`This site is running on ${port}`)
})

app.post('/additemdetails', (req, res) => {
    if (db) {
        db.collection('itemdetails').insertOne(req.body, (err, result) => {
            if (err) {
                res.send({
                    message: 'Server side  error!',
                    status: 500
                });
            } else {

                res.send({ status: 200, message: "item details added successfully" })
            }
        })
    } else {
        response.send({
            message: 'Db connection error!',
            status: 500
        });
    }

})

app.get('/viewItemDetails',  (request, response)=> {
    if (db) {
        db.collection('itemdetails').find().toArray( (error, result) =>{
            if (error) {
                response.send({
                    message: 'not found!',
                    status: 404
                });
            } else {

                response.send({ status: 200, message: "food details retrieved successfully", data: result })
            }
        })
    } else {
        response.send({
            message: 'Db connection error!',
            status: 500
        });
    }
})

app.get('/category_id',(req,res)=>{
    let categoryId = Number(req.query.categoryId);
    let prodId = Number(req.query.prodId)
    let query = {}
    if(categoryId){
        query = {category_id:categoryId}
    }else if(prodId){
        query = {"itemTypes.type_id":prodId}
    }else{
        query = {}
    }
    db.collection('products').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// filter items
app.get('/filter/:prod_id',(req,res) => {
    let query = {};
    let sort = {cost:1}
    let productId = Number(req.params.prodId);
    let type = Number(req.query.typeId);
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);

    if(req.query.sort){
        sort={cost:req.query.sort}
    }

    if(hcost && lcost && cuisineId){
        query={
            "itemTypes.type_id":prodId,
            $and:[{cost:{$gt:lcost,$lt:hcost}}]
        }
    }
    else if(hcost && lcost){
        query={
            "itemTypes.type_id":prodId,
            $and:[{cost:{$gt:lcost,$lt:hcost}}]
        }
    }
    else if(categoryId){
        query={
            "itemTypes.type_id":prodId,
            "category.category_id":categoryId
        }
    }else{
        query={
            "itemTypes.type_id":prodId
        }
    }
    db.collection('products').find(query).sort(sort).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


// order details
app.get('/orders',(req,res)=>{
    //let email = req.query.email
    let email = req.query.email;
    let query = {}
    if(email){
        //query={email:email}
        query={email}
    }else{
        query={}
    }
    db.collection('orders').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// view orders
app.get('/orders',(req,res)=>{
    //let email = req.query.email
    let email = req.query.email;
    let query = {}
    if(email){
        //query={email:email}
        query={email}
    }else{
        query={}
    }
    db.collection('orders').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


// place an order
app.post('/placeOrder',(req,res) => {
    db.collection('orders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send('Order Placed')
    })
})

app.put('/updateOrder/:id',(req,res) => {
    let oid = Number(req.params.id);
    db.collection('orders').updateOne(
        {id:oid},
        {
            $set:{
                "status":req.body.status,
                "bank_name":req.body.bank_name,
                "date":req.body.date
            }
        },(err,result) => {
            if(err) throw err;
            res.send('Order Updated')
        }
    )
})

app.delete('/deleteOrder/:id',(req,res) => {
    let _id = mongo.ObjectId(req.params.id);
    db.collection('orders').remove({_id},(err,result) => {
        if(err) throw err;
        res.send('Order Deleted')
    })
})