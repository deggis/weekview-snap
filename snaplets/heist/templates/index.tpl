<apply template="base">

  <ifLoggedIn>
    <div id="weekview">
    </div>
    <script type="text/javascript">
      weekview_app.run();
    </script>
  </ifLoggedIn>

  <ifLoggedOut>
    <apply template="_login"/>
  </ifLoggedOut>

</apply>
