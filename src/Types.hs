{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TemplateHaskell #-}

module Types where

import           Control.Applicative
import           Control.Monad
import           Control.Lens hiding ((.=))
import           Database.PostgreSQL.Simple hiding (query_)
import           Database.PostgreSQL.Simple.ToField (toField)          
import           Snap.Snaplet.PostgresqlSimple
import           Data.Aeson
import qualified Data.Text as T
import           Data.Time

data Project = Project 
    { _projectId   :: Int
    , _projectName :: T.Text
    , _parent      :: Maybe Int
    } deriving (Show)

makeLenses ''Project

instance Eq Project where
    p1 == p2 = view projectId p1 == view projectId p2

instance FromRow Project where
    fromRow =  Project
           <$> field -- proj. id
           <*> field -- name
           <*> field -- parent

instance ToJSON Project where
    toJSON (Project i n p) = object $ fParent p ["id" .= i, "name" .= n]
      where fParent (Just i) xs = ("parent" .= i) : xs
            fParent _        xs = xs 





data Session = Session
    { _sessionId        :: Maybe Int
    , _sessionProjectId :: Int
    , _startTime        :: UTCTime
    , _endTime          :: UTCTime
    , _description      :: T.Text
    } deriving (Show)

makeLenses ''Session

instance Eq Session where
    s1 == s2 = view sessionId s1 == view sessionId s2

instance FromRow Session where
    fromRow =  Session
           <$> field -- sess. id
           <*> field -- proj. id
           <*> field -- start
           <*> field -- end
           <*> field -- description

-- instance for new session
-- for new Sessions use Nothing as id;
-- updating existing Session with id=Nothing
-- will result to an error.
instance ToRow Session where
    toRow (Session i p s e d) = [toField p
                                ,toField s
                                ,toField e
                                ,toField d]

instance ToJSON Session where
    toJSON (Session i pid s e d) =
        object [ "id" .= i
               , "projectId" .= pid
               , "start" .= s
               , "end" .= e
               , "description" .= d ]

instance FromJSON Session where
    parseJSON (Object v) = Session
                       <$> pure Nothing
                       <*> v .: "project_id"
                       <*> v .: "start"
                       <*> v .: "end"
                       <*> v .: "description"
    parseJSON _          = mzero
