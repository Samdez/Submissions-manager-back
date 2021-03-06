import { db } from '../../firebase/config';
import { auth } from "../../firebase/config";
import { Box, Button, makeStyles, Paper, TextField } from "@material-ui/core";
import { useEffect, useRef, useState } from 'react';

const useStyles = makeStyles(() => ({
  flex: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center",
    width: '50%'
  },
  userComment: {
    width: '30%',
    marginBottom: '1em',
    backgroundColor: '#80e27e',
    alignSelf: 'flex-end'
  },
  otherUserComment: {
    width: '30%',
    marginBottom: '1em',
    backgroundColor: '#ff6090',
    alignSelf: 'flex-start'
  },
  inputText: {
    width: '100%'
  }
}));

const Comments = ({ id }) => {
  const classes = useStyles();
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);
  const userId = auth.currentUser.uid;
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsubscribe = db.collection('comments').orderBy('added').onSnapshot(snap => {
      const data = snap.docs.map(doc => doc.data())
      setCommentsList(data)
    });

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [commentsList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      db.collection('comments')
        .add({
          added: new Date(),
          trackId: id,
          content: comment,
          author: userId
        })
    } catch (err) {
      console.log(err);
    }
    setComment('');
  }

  return (
    <Box
      display="flex"
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      >
      <h1>Comments</h1>
      <Box
        display="flex"
        flexDirection='column'
        justifyContent="center"
        alignItems='center'
        width='50%'
        maxHeight='30vh'
        overflow='auto'
        padding="5px"
      >
        {
          commentsList
            .filter(comment => comment.trackId === id)
            .map(comment => {
              return comment.author === userId
                ?
                <Paper
                  elevation={2}
                  className={classes.userComment}
                  ref={scrollRef}
                >{comment.content}
                </Paper>
                :
                <Paper
                  elevation={2}
                  className={classes.otherUserComment}
                  backg
                >{comment.content}
                </Paper>
            })
        }
          </Box>
        <form onSubmit={handleSubmit} className={classes.flex}>
          <TextField
            id="outlined-multiline-static"
            label="Comment"
            multiline
            className={classes.inputText}
            rows={4}
            placeholder="leave a comment"
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button type='submit'>Post</Button>
        </form>
    </Box>
  );
}

export default Comments;