const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const app = express();
admin.initializeApp({
  credential: admin.credential.cert("permissions.json"),
  databaseURL:"firebase-adminsdk-3f5a5@trabajoverano-41581.iam.gserviceaccount.com",
});
const db = admin.firestore();
app.get("/", (req, res)=>{
  return res.json({message: "hello world"});
});

//POST
app.post("/api/:inmueble", async(req, res)=> {
  let inmueble= req.params.inmueble;
  try{
    const {Id,Name, Price, Quality}=req.body
    await db.collection(inmueble)
    .doc("/" + Id + "/")
    .create({
      Name: Name,
      Price: Price,
      Quality: Quality
    });
    return res.status(204).json();
     /* .doc("/" + req.body.id + "/")
      .create({name: req.body.name});*/

  }
  catch(error){
    console.log(error);
    return res.status(500).send(error);
  }
 
});

//GET individual
app.get("/api/:inmueble/:id", async(req, res)=>{
  let inmueble= req.params.inmueble;

    try{
      const doc= db.collection(inmueble).doc(req.params.id);
      const item = await doc.get()
      const response= item.data()
      return res.status(200).json(response)
    } catch(error){
      return res.status(500).send(error)
    }
})


//GET completo
app.get("/api/:inmueble", async(req, res)=>{

  let inmueble=req.params.inmueble;
  try {
    const doc=db.collection(inmueble);
    const item= await doc.get()
    const docs= item.docs;

    const response = docs.map(doc => ({
      id: doc.id,
      Name: doc.data().Name,
      Quality: doc.data().Quality,    
  }))
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).send(error)
  }

})

//DELETE
app.delete("/api/:inmueble/:id", async(req, res)=>{
try {
  
  let inmueble= req.params.inmueble;
  let id= req.params.id;
  const document= db.collection(inmueble).doc(id);
  await document.delete();
  return res.status(200).json();
} catch (error) {
  return res.status(500).json();
  
}

})

//PUT
app.put("/api/:inmueble/:id",async(req, res)=>{
  let inmueble= req.params.inmueble;
  let id= req.params.id;
  const document= db.collection(inmueble).doc(id);
  await document.update({
    Name: req.body.Name,
    Price: req.body.Price,
    Quality: req.body.Quality,
  })
} )

exports.app = functions.https.onRequest(app);
