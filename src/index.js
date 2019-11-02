import { GraphQLServer } from 'graphql-yoga';

// Scalar Types: String, Boolean, Int, Float, ID


//Type definations (schema)
const typeDefs = `
 type Query {
     greeting(name: String, position: String): String! 
     add(numbers: [Float!]!): Float!
     grades: [Int!]!
     me: User!
     post: Post!
 }
 
 type User {  
     id: ID!
     name: String!
     email: String!
     age: Int
 }

 type Post {
     id: ID!
     title: String!
     body: String!
     published: Boolean!
 }

`

// Resolvers
const resolvers = {
    Query: {
        greeting(parent, args, ctx, info) {
            if (args.name && args.position) {
                return `Hello ${args.name} with position ${args.position}`
            }
        },
        add(parent, args, ctx, info) {
            if (args.numbers.length === 0) {
                return 0;
            }
            return args.numbers.reduce((accomulator, currentValue) => {
                return accomulator + currentValue
            })
        },
        grades(parent, args, ctx, info) {
            return [99, 45, 45]
        },
        me() {
            return {
                id: '1234',
                name: 'Usman',
                email: 'usman@gmail.com'
            }
        },
        post() {
            return {
                id: '123',
                title: 'story telling',
                body: 'body content',
                published: false
            }
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log(`the server is up!`)
})