import { API } from "aws-amplify";
import { getUser } from "../graphql/queries";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { PostList } from "../components/postList-comp";
import { UserType } from "../types/UserType";
import { Menu } from "../components/menu-comp";
import { duplicatesByMonth } from "../utils/duplicates";
import { listAllUserPosts, listUserPosts } from "../utils/listdata";
import { sortData } from "../utils/sort";
import { BsChevronDown } from "react-icons/bs";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import React from "react";

//would love to reuse a lot of the dashboard and tried.
//Some confusion and funkiness between using user token on initial login vs grabbing data and using current friend. !fix
//future me note - can switch between user if id params exist - see friendslist component

type Props = {
  user: UserType;
  friends: UserType[];
  setFriends: React.Dispatch<React.SetStateAction<UserType[]>>;
  currentFriend?: UserType;
  setCurrentFriend?: React.Dispatch<React.SetStateAction<UserType>>;
  signOut: any;
};

export function UserFriend({
  friends,
  setFriends,
  currentFriend,
  setCurrentFriend,
  signOut,
}: Props) {
  const { id } = useParams<string>();

  useEffect(() => {
    
    getUserinfo().then((data) => {
      setCurrentFriend(data.data.getUser);
    });
  }, []); //eslint-disable-line

  const getUserinfo = async () => {
    const userData: GraphQLResult<any> = await API.graphql({
      query: getUser,
      authMode: "AMAZON_COGNITO_USER_POOLS",
      variables: { id: id },
    });
    return userData;
  };

  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [noPosts, setNoPosts] = useState<boolean>(false);
  const [token, setToken] = useState<string>();

  useEffect(() => {
    listUserPosts(id).then((data) => {
      setPosts(data.data.postByUser.items);
      const tokenID = data.data.postByUser.nextToken;
      setToken(tokenID);
    });
  }, []); //eslint-disable-line

  useEffect(() => {
    listAllUserPosts(id).then((data) => {
      const listData = data.data.postByUser.items;
      sortData(listData);
      setAllPosts(duplicatesByMonth(listData));
      if (listData.length === 0) {
        setNoPosts(true);
      } else {
        setNoPosts(false);
      }
    });
  }, []); //eslint-disable-line

  async function newPage() {
    listUserPosts(id, token).then((data) => {
      if (token === null || undefined) return;
      setPosts((prev) => {
        return [...prev, ...data.data.postByUser.items];
      });
      const tokenID = data.data.postByUser.nextToken;
      setToken(tokenID);
    });
  }

  if (noPosts === true) {
    return (
      <>
        <Menu
          user={currentFriend}
          friends={friends}
          setFriends={setFriends}
          allPosts={allPosts}
          posts={posts}
          setPosts={setPosts}
          token={token}
          setToken={setToken}
          signOut={signOut}
        />
        <div id="nodata">
          <h3>No posts to display ʕ ´•̥̥̥ ᴥ•̥̥̥`ʔ</h3>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="container">
          <PostList
            posts={posts}
            setPosts={setPosts}
            currentFriend={currentFriend} setAllPosts={setAllPosts}/>
          <Menu
            user={currentFriend}
            friends={friends}
            setFriends={setFriends}
            allPosts={allPosts}
            posts={posts}
            setPosts={setPosts}
            token={token}
            setToken={setToken}
            signOut={signOut}
          />
          <button id="footer" onClick={newPage}>
            <BsChevronDown />
          </button>
        </div>
      </>
    );
  }
}
