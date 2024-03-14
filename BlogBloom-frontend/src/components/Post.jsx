import { format } from "date-fns"
import { Link } from "react-router-dom"

function Post({ _id,title, summary, content, cover, createdAt,author }){
    return(
        <div className="post">
            <div className="image">
                <Link to={`/post/${_id}`}>
                    <img src={`http://localhost:3000/${cover}`} alt="" />
                </Link>
            </div>
            <div className="text">
                <Link to={`/post/${_id}`}>
                    <h2>{title}</h2>
                </Link>
                <p className="info">
                    <a href="" className="author">{author.username}</a>
                    <time>{format(new Date(createdAt), 'MMM dd, yyyy')}</time>
                </p>
                <p className='summary'>{summary}</p>
            </div>
        </div>
    )
}
export default Post