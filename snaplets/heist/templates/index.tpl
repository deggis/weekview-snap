<apply template="base">

  <ifLoggedIn>
    <div id="weekview">
    </div>
  </ifLoggedIn>

  <ifLoggedOut>
    <apply template="_login"/>
  </ifLoggedOut>

</apply>
