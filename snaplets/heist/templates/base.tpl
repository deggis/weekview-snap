<!DOCTYPE html>
<html>
  <head>
    <title>Weekview</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
    <link rel="stylesheet" type="text/css" href="/bs2.3.2/css/bootstrap.css" media="screen">
    <style>
      body {
        padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
      }
    </style>
    <link rel="stylesheet" type="text/css" href="/bs2.3.2/css/bootstrap-responsive.css" media="screen">
    <link rel="stylesheet" type="text/css" href="/css/weekview.css"/>
  </head>
  <body>
   <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="brand" href="#">Weekview</a>
          <div class="nav-collapse collapse">
            <ul class="nav">
              <li class="active"><a href="#">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>

    <div class="container">
        <apply-content/>
    </div>
    <script type="text/javascript" src="/js/jquery-1.10.1.js"></script>
    <script type="text/javascript" src="/bs2.3.2/js/bootstrap.min.js"></script>
    <ifLoggedIn>
      <script type="text/javascript" src="/js/weekview.js"></script>
    </ifLoggedIn>
  </body>
</html>
