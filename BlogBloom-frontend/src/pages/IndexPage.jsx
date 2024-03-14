import { useEffect, useState } from "react"
import Post from "../components/Post"

function IndexPage(){
    const [posts,setPosts]=useState([])
    useEffect(() => {
        
        fetch('http://localhost:3000/posts', {
            method: 'GET',
        }).then(res => {
            res.json().then(posts => {
                console.log(posts)
                setPosts(posts)
            });
        });
    }, []);
    return(
        <div>
            {posts.length>0 && posts.map(post=>(
                <Post key={post._id} {...post}/>
            ))}
            
        </div>
    )
}
export default IndexPage