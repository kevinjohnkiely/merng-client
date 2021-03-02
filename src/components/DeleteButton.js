import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { FETCH_POSTS_QUERY } from '../util/graphql'

import { Button, Confirm, Icon } from 'semantic-ui-react'
import MyPopup from '../util/MyPopup'

function DeleteButton (props){
    const [confirmOpen, setConfirmOpen] = useState(false)

    const mutation = props.commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy){
            setConfirmOpen(false)
            if(!props.commentId){
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                })
                data.getPosts = data.getPosts.filter(p => p.id !== props.postId)
                proxy.writeQuery({ query: FETCH_POSTS_QUERY, data})
            }
            if(props.callback) props.callback()
        },
        variables: {
            postId: props.postId,
            commentId: props.commentId
        }
    })

    return (
        <>
        <MyPopup
            content={props.commentId ? 'Delete comment' : 'Delete post'}>
        <Button 
                floated="right" 
                as="div" 
                color="red" 
                onClick={() => setConfirmOpen(true)}
            >
                  <Icon name='trash' style={{ margin: 0 }} />
            </Button>
        </MyPopup>    
        <Confirm open={confirmOpen}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={deletePostOrComment} />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteCOmment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments {
                id username createdAt body
            }
            commentCount
        }
    }
`

export default DeleteButton