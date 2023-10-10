import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import {typeDefs} from './schema.js';
import db from './_db.js'
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
type Param={
    id: string
}
type AddG={
    game: {title: string,platform: string[]}
}
type UpdateG={
    id: string,
    edits: {title?: string,platform?: string[]}
}
const resolvers = {
    Query: { //resolvers for entrypoints as defined in our schema
        games(){
            return db.games;
        },
        reviews() {
            return db.reviews;
        },
        authors() {
            return db.authors;
        },
        review(parent: object,args: Param,context: object){
            return db.reviews.find((review)=>review.id===args.id);
        },
        game(parent: object,args: Param,context: object){
            return db.games.find((game)=>game.id===args.id);
        },
        author(parent: object,args: Param,context: object){
            return db.authors.find((author)=>author.id===args.id);
        }
        /**
         * parent-->previous/parent resolver in a resolver chain
         * args-->access query variables
         * context-->supply context values across all our resolvers like auth info
         */
    },
    Game: { //the server will look the at the Game object to resolve its reviews query 
        reviews(parent: Param){ //we can access the game id using parent to know which games's review are we talking about
            return db.reviews.filter((r)=>r.game_id===parent.id);
        }
    },
    Author: {
        reviews(parent: Param){
            return db.reviews.filter((r)=>r.author_id===parent.id);
        }
    },
    Review: {
        game(parent: Param){
            return db.games.find((g)=>g.id===parent.id)
        },
        author(parent: Param){
            return db.authors.find((a)=>a.id===parent.id)
        }
    },
    Mutation: {
        deleteGame(_:object,args:Param){
            db.games=db.games.filter((g)=>g.id !== args.id); //this can be a real db delete operation
            return db.games;
        },
        addGame(_:object,args:AddG){
            let game={
                ...args.game,
                id: Math.floor(Math.random()*100000000).toString()
            }
            db.games.push(game)
            return game
        },
        updateGame(_:object, args:UpdateG) {
            db.games = db.games.map((g) => {
              if (g.id === args.id) {
                return {...g, ...args.edits}
              }
      
              return g
            })
      
            return db.games.find((g) => g.id === args.id)
        }
    }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs, //definition of types of data
    resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);