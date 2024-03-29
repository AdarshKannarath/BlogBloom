import { useEffect, useState } from "react"
import Post from "../components/Post"
import { useLocation } from "react-router-dom";

function IndexPage(){
    const [posts,setPosts]=useState([])
    const { search } = useLocation()
    useEffect(() => {
        
        fetch(`${window.location.origin}/posts` + search, {
            method: 'GET',
        }).then(res => {
            res.json().then(posts => {
                console.log(posts)
                setPosts(posts)
            });
        });
    }, [search]);
    return(
        <div>
            {posts.length>0 && posts.map(post=>(
                <Post key={post._id} {...post}/>
            ))}
            
        </div>
    )
}
export default IndexPage