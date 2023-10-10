export const typeDefs=`#graphql
    type Game{
        id: ID!
        title: String!
        platform: [String!]!
        reviews: [Review!]!
    }
    type Review{
        id: ID!
        rating: Int!
        content: String!
        author: Author!
        game: Game!
    }
    type Author{
        id: ID!
        name: String!
        verified: Boolean!
        reviews: [Review!]
    }
    type Query{ #entrypoints
        reviews: [Review]
        review(id: ID!): Review
        games: [Game]
        game(id: ID!): Game
        authors: [Author]
        author(id: ID!): Author
    }
    type Mutation{
        addGame(game: AddGameInput!): Game
        deleteGame(id: ID!): [Game] #returning updated db
        updateGame(id: ID!,edits: EditGameInput!): Game
    }
    input AddGameInput{ #not an actual type but a collection of fields which we use in our mutation
        title: String!,
        platform: [String!]!
    }
    input EditGameInput{
        title:  String,
        platform: [String!]
    }
`;
//'!' means the field is required
//String , Int , Float , Boolean , and ID are the scalar types
/**
 * type Query{
 *   reviews: [Reviews]
 * } it is an entrypoint whose return type is a list of Reviews and not single review.
 */