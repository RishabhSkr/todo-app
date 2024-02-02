const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());  

app.listen(port,()=>{
    console.log("Server is Started at port :"+port);
});

const filePath = path.join(__dirname,'todo.json'); // Safely join the file path

//GET
// app.get('/todos', (req, res) => {
//    try{
//      const data = fs.readFileSync(filePath,'utf-8',callabckFn);
//      const todoTasks = JSON.parse(data);
//      res.status(201).send(todoTasks);
//    }catch(err){
//     console.log("Error in getting file data!!",err);
//     res.status(500).json({error : "Error getting Tasks"});
//    }  
//   });

// fs.readFile() : asynchromus file reading // fs.readFileSync() synchornous file reading
app.get('/todos', (req, res) => {
   try{
     const data = fs.readFile(filePath,'utf-8',(err,data)=>{
      
       res.status(201).send(JSON.parse(data));

     });
   }catch(err){
    console.log("Error in getting file data!!",err);
    res.status(500).json({error : "Error getting Tasks"});
   }
     
  });
// CREATE
  app.post('/todos',(req,res)=>{
    const newTodo = {
      id: Math.floor(Math.random() * 1000000), // unique random id
      title: req.body.title,
      description: req.body.description
    };

    let todoTask =[];
    try{
      const data = fs.readFile(filePath,'utf-8',(err,data)=>{

        todoTask = JSON.parse(data);
        todoTask.push(newTodo);

        //writing in a file
        fs.writeFile(filePath,JSON.stringify(todoTask,null,2),'utf-8');  
        res.status(201).json({message: 'Task added successfully',task : newTodo });
      });
    }catch(err){
      console.log("Error in parsing Data!!",err);
    }

  });

  // DELETE 
  function removeAtIndex(arr,todoIndex){
    let newTodo=[];
    for(var i = 0 ;i<arr.length;++i){
        if(i!=todoIndex)newTodo.push(arr[i]);
    }
    return newTodo;
}

function findById(todos, id) {
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      return i; // Return the index of the found ID
    }
  }
  return -1; // Return -1 if ID is not found
}

app.delete('/todos/:id',(req,res)=>{
   try{
      const data = fs.readFile(filePath,'utf-8',(err,data)=>{
        const todos = JSON.parse(data);
        const todoID = findById(todos,parseInt(req.params.id));
       
        if(todoID===-1){
          res.status(404).send("ID Not Found!!")
        }else{
          todos = removeAtIndex(todos,todoID);
      
          fs.writeFile(filePath,JSON.stringify(todos,null,2),'utf-8');  
          res.status(200).send("Deleted Successfully!!");
        }

      });
   }catch(err){
    res.status(500).send("Error: File Not Found or Parsing Error!",err);
   } 
});


// search TODOS
 app.get('/todos/:id',(req,res)=>{
    try{
        
        const data = fs.readFile(filePath,'utf-8',(err,data)=>{
          const todos = JSON.parse(data);
          const todoID = findById(todos,parseInt(req.params.id));
          if(todoID==-1)res.status(404).send("ID Doesn't Exist");
          else{
            res.status(200).json(todos[todoID]);
          }

        });
    }catch(err){
        res.status(500).send("Message :Error Getting File",err)
    }
 })



 app.use('/',(req,res)=>{
        res.sendFile(path.join(__dirname,"index.html"));
 });


app.all('*', (req, res) => {
    res.status(404).send('Route not found');
});
  
  module.exports = app;