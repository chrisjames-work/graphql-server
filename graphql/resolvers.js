const find = require('lodash/find');
const map = require('lodash/map');
const pubsub = require('./pubsub');

const data = {
  meetups: [
    {
      id: "1",
      name: "BrooklynJS",
      description: "BrooklynJS is a monthly meeting of JavaScript developers which happens on the third Thursday of each month in the upstairs event space at 61 Local, a restaurant and bar in Cobble Hill, Brooklyn.",
      price: 15,
      priceFormatted: "$15",
      isAvailable: false,
    },
    {
      id: "2",
      name: "JerseyScript",
      description: "It's a web developer social  in Jersey City which meets on the last tuesday of every month!",
      price: 10,
      priceFormatted: "$10",
      isAvailable: false,
    },
    {
      id: "3",
      name: "ManhattanJS",
      description: "ManhattanJS is an NYC meetup celebrating everything about JavaScript (and a lot of things that aren't JavaScript, too). We're part of the BoroJS family of meetups in NYC (BrooklynJS, QueensJS, JerseyScript &). We come together on the second Wednesday of every month to learn and connect with other members of the NYC development community.",
      price: 10,
      priceFormatted: "$10",
      isAvailable: false,
    },
    {
      id: "4",
      name: "QueensJS",
      description: "On the first Wednesday of every month, programmers from all over New York City gather in New York’s largest borough to discuss the passions and pitfalls of the language that is everywhere, JavaScript.",
      price: 5,
      priceFormatted: "$5",
      isAvailable: false,
    },
    {
      id: "5",
      name: "Rick and Morty Enthusiasts",
      description: "I'm Mr. Meeseeks, look at me!",
      price: 0,
      priceFormatted: "Free",
      isAvailable: true,
    },
  ],
  wishlist: [
    "1",
    "5",
  ],
  comments: [
    {
      id: "1",
      // timestamp: new Date(),
      user: "Chris",
      message: "How can I help you today?"
    }
  ]
}

const COMMENT_ADDED_TOPIC = 'newComment';

const resolvers = {
  RootQuery: {
    meetups: () => data.meetups,
    meetup: (_, { id }) => find(data.meetups, { id: id }),
    wishlist: () => ({
      meetups: map(data.wishlist, (meetupId) => find(data.meetups, { id: meetupId })),
    }),
    comments: () => data.comments
  },
  Mutation: {
    addMeetup: (_, { name, description }) => {
      console.log('new meetup:', name, description);
      const newMeetup = {
        id: data.meetups.length + 1,
        name: name,
        description: description,
        price: 15,
        priceFormatted: "$15",
        isAvailable: false,
      };

      // side effect - save to "db"
      data.meetups.push(newMeetup);

      return newMeetup;
    },
    addComment: (_, { user, message }) => {
      console.log('new comment:', user, message);
      const newComment = {
        id: data.comments.length + 1,
        user,
        message
      };

      // side effect - save to "db"
      data.comments.push(newComment);
      // publish for subscription
      pubsub.publish(COMMENT_ADDED_TOPIC, { commentAdded: newComment})

      return newComment;
    }
  },
  Subscription: {
    commentAdded: {
      subscribe: () => pubsub.asyncIterator(COMMENT_ADDED_TOPIC)
    }
  },
};

// pubsub.publish('commentAdded', { commentAdded: { id: 1, content: 'Hello!' }})

module.exports = resolvers;
