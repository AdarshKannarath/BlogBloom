import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill"
const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
    ],
}

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
]
export default function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3000/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    console.log(postInfo.postDoc.title)
                    setTitle(postInfo.postDoc.title);
                    setContent(postInfo.postDoc.content);
                    setSummary(postInfo.postDoc.summary);
                });
            });
    }, [id]);

    async function updatePost(ev) {
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if (files?.[0]) {
            data.set('file', files?.[0]);
        }
        const response = await fetch(`http://localhost:3000/post`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Failed to update post: ${errorMessage}`);
        } else {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/post/' + id} />
    }

    return (
        <form onSubmit={updatePost}>
            <input type="title"
                placeholder={'Title'}
                value={title}
                onChange={ev => setTitle(ev.target.value)} />
            <input type="summary"
                placeholder={'Summary'}
                value={summary}
                onChange={ev => setSummary(ev.target.value)} />
            <input type="file"
                onChange={ev => setFiles(ev.target.files)} />
            <ReactQuill
                value={content}
                modules={modules}
                formats={formats}
                onChange={(newValue) => setContent(newValue)}
            />
            <button style={{ marginTop: '5px', backgroundColor: '#555', color: 'white' }}>Update post</button>
        </form>
    );
}