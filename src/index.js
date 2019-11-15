import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4'

// Scalar Types: String, Boolean, Int, Float, ID

const users = [
    { id: '1', name: 'Jamie', age: null, postId: '1' },
    { id: '2', name: 'Andrew', age: 27, postId: '2' },
    { id: '3', name: 'Katie', age: null, postId: '1' }
]

const posts = [
    { id: '1', title: 'hjdsbf', body: 'hjdsbfjk', published: true, author: '1', commentId: '1' },
    { id: '2', title: 'sdnjf', body: 'sdbfjkb', published: false, author: '2', commentId: '2' },
    { id: '3', title: 'sdjkf', body: 'sdhjodsh', published: true, author: '1', commentId: '3' },
]

const comments = [
    { id: '1', text: 'Nice laptop', author: '1', postId: '1' },
    { id: '2', text: 'Nice keyboard', author: '2', postId: '2' },
    { id: '3', text: 'Nice Jacket', author: '1', postId: '1' },
    { id: '4', text: 'Nice Shoes', author: '2', postId: '2' }
]


//Type definations (schema)
const typeDefs = `
 type Query {
     users(query: String): [User!]!
     posts(query: String): [Post!]!
     comments: [Comment!]!
 }
 
 type Mutation {
     createUser(data: CreateUserInput!) : User!
     deleteUser(id: ID!): User!
     createPost(data: CreatePostInput!): Post!
     createComment(data: CreateCommentInput): Comment!
 }

 input CreateUserInput {
     name: String!
     email: String!
     age: Int    
 }

 input CreatePostInput {
     title: String!
     body: String!
     published: Boolean!
     author: ID!
 }

 input CreateCommentInput {
     text: String!
     author: ID!
     post: ID!
 }

 type User {  
     id: ID!
     name: String!  
     email: String!
     age: Int
     posts: [Post!]!
     comments: [Comment!]!
 }
                                                                                                                                             
 type Post {
     id: ID! 
     title: String!
     body: String!
     published: Boolean!
     author: User!
     comments: [Comment!]!
 }

 type Comment {
     id: ID!
     text: String!
     author: User!
     post: Post!
 } 

`

// Resolvers
const resolvers = {
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some(user => user.email === args.data.email)
            if (emailTaken) throw new Error('Email taken')

            const user = {
                id: uuidv4(),
                ...args.data
            }
            users.push(user)

            return user;
        },
        deleteUser(parent, args, ctx, info) {

        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author)
            if (!userExists) throw new Error('User Doest Exists with this Email')

            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post)

            return post;
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author)
            if (!userExists) throw new Error('User Doest Exists with this Email')

            const postExists = posts.some(post => (post.id === args.data.post && post.published))
            if (!postExists) throw new Error('Post Doest Exists with this ID. ')

            if (userExists && postExists) {
                const comment = {
                    id: uuidv4(),
                    ...args.data
                }

                comments.push(comment)
                return comment;
            }
        }
    },
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users;
            }
            return users.filter((user) => user.name.toLowerCase().includes(args.query.toLowerCase()))
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }
            return posts.filter(post =>
                (post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())))
        },
        comments(parent, args, ctx, info) {
            return comments;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => {
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.postId === parent.id)
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            // console.log(parent)
            return posts.filter(post => post.id === parent.postId)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.author === parent.id)
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        },
        post(parent, args, ctx, info) {
            return posts.find(post => post.id === parent.postId)
        }
    },

}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log(`the server is up!`)
})