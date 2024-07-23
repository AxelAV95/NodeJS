const mainPage = (req, res) => {
  res.status(200).send(`


  <style>

  body,html{
margin:auto;
max-width:800px;
padding:1rem;
  }


.block{
    padding:1rem;
    margin:2px;
    background:#e7e7e7
}




.get, .type{
    color:green;
}

.post{
    color:blue;
}

.patch{
    color:orange;
}

.delete{
    color:red;
}

.route_info{
    padding:1rem;
    background:#ccc;
}

  </style>



    <h1>
Welcome to Movies DB Dummy API. Your Server is working fine!
     </h1>


     <div class="block">
     Base URL: <br/> <b> http://localhost:4000/api</b>
<br/>
     <i><small>Make sure your app is  listening to port 4000 on app.js</small></i>

     </div>



     <h3>API list & routes:</h3>


     <div class="block">

     <div class="route">
    <span class="get">GET</span> /movies <br/>
    </div>

    <div class="route_info">
    Get all movies.
    </div>

     </div>



     <br/><br/>
     <div class="block">

     <div class="route">
    <span class="get">GET</span> /movies/{movie_id} <br/>
    </div>

    <div class="route_info">
    Get single movie
    </div>

     </div>




<br/><br/>

<div class="block">

<div class="route">
<span class="post">POST</span> /movies <br/>
</div>

<div class="route_info">
Add a movie to database
</div>

<div class="route_info">
Payload: <br/><br/>

<b>movie_name</b>: Required <br/>
<span class="type">string</span><br/>
Name of the movie
<br/><br/>




<b>info</b>: Required <br/>
<span class="type">string</span><br/>
Movie info
<br/><br/>


<b>rating</b>: Required <br/>
<span class="type">number</span><br/>
Rating of movie, between 1-10
<br/><br/>
</div>

</div>



<br/><br/>


<div class="block">

     <div class="route">
    <span class="patch">PATCH</span> /movies <br/>
    </div>

    <div class="route_info">
    Edit a movie
    </div>

    <div class="route_info">
   Payload: <br/><br/>

   <b>movie_id</b>: Required <br/>
   <span class="type">string</span><br/>
   ID of movie for editing
   <br/><br/>
  


Other parameters: <br/>
  movie_name, info, rating
    </div>

     </div>





     <br/><br/>
     <div class="block">

     <div class="route">
    <span class="delete">DELETE</span> /movies/{movie_id} <br/>
    </div>

    <div class="route_info">
    Delete a movie
    </div>

     </div>


    
    
    
    `);
};

module.exports = mainPage;
