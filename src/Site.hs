{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE NoMonomorphismRestriction #-}

module Site
  ( app
  ) where

------------------------------------------------------------------------------
import           Control.Applicative
import           Control.Lens
import           Data.ByteString as B (ByteString,concat)
import qualified Data.ByteString.Lazy as BL
import           Data.Maybe
import qualified Data.Text as T
import           Data.Aeson as JSON
import           Snap.Core
import           Snap.Snaplet
import           Snap.Snaplet.Auth
import           Snap.Snaplet.Auth.Backends.JsonFile
import           Snap.Snaplet.Heist
import           Snap.Snaplet.Session.Backends.CookieSession
import           Snap.Snaplet.PostgresqlSimple
import           Snap.Util.FileServe
import           Heist
import qualified Heist.Interpreted as I
import           Application
import           Types

handleLogin :: Maybe T.Text -> Handler App (AuthManager App) ()
handleLogin authError = heistLocal (I.bindSplices errs) $ render "login"
  where
    errs = [("loginError", I.textSplice c) | c <- maybeToList authError]


handleLoginSubmit :: Handler App (AuthManager App) ()
handleLoginSubmit =
    loginUser "login" "password" Nothing
              (\_ -> handleLogin err) (redirect "/")
  where
    err = Just "Unknown user or password"


handleLogout :: Handler App (AuthManager App) ()
handleLogout = logout >> redirect "/"

printProjects :: Handler App App ()
printProjects = do
    posts :: [Project] <- query_ "select * from weekview_projects"
    writeJSON posts

printSessions :: Handler App App ()
printSessions = do
    sessions :: [Session] <- query_ "select * from weekview_sessions"
    writeJSON sessions

routes :: [(ByteString, Handler App App ())]
routes = [ ("/login",    with auth handleLoginSubmit)
         , ("/logout",   with auth handleLogout)
         , ("/projects", printProjects)
         , ("/sessions", printSessions)
         , ("",          serveDirectory "static")
         ]


app :: SnapletInit App App
app = makeSnaplet "app" "An snaplet example application." Nothing $ do
    h <- nestSnaplet "" heist $ heistInit "templates"
    s <- nestSnaplet "sess" sess $
           initCookieSessionManager "site_key.txt" "sess" (Just 3600)

    a <- nestSnaplet "auth" auth $
           initJsonFileAuthManager defAuthSettings sess "users.json"

    d <- nestSnaplet "db" db pgsInit
    
    addRoutes routes
    addAuthSplices h auth
    return $ App h s a d


toStrict :: BL.ByteString -> B.ByteString
toStrict = B.concat . BL.toChunks

writeJSON = writeBS . toStrict . JSON.encode
