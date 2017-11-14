const find = require('lodash/find');
const map = require('lodash/map');
const pubsub = require('./pubsub');

const data = {
  // meetups: [
  //   {
  //     id: "1",
  //     name: "BrooklynJS",
  //     description: "BrooklynJS is a monthly meeting of JavaScript developers which happens on the third Thursday of each month in the upstairs event space at 61 Local, a restaurant and bar in Cobble Hill, Brooklyn.",
  //     price: 15,
  //     priceFormatted: "$15",
  //     isAvailable: false,
  //   },
  //   {
  //     id: "2",
  //     name: "JerseyScript",
  //     description: "It's a web developer social  in Jersey City which meets on the last tuesday of every month!",
  //     price: 10,
  //     priceFormatted: "$10",
  //     isAvailable: false,
  //   },
  // ],
  // wishlist: [
  //   "1",
  //   "5",
  // ],
  comments: [
    {
      id: "1",
      // timestamp: new Date(),
      type: "text",
      user: "Chris",
      message: "How can I help you today?"
    }
  ]
}

const COMMENT_ADDED_TOPIC = 'newComment';

const COMMENT_TYPES = {
  TEXT: 'text',
  FILE: 'file'
};

const resolvers = {
  RootQuery: {
    // meetups: () => data.meetups,
    // meetup: (_, { id }) => find(data.meetups, { id: id }),
    // wishlist: () => ({
    //   meetups: map(data.wishlist, (meetupId) => find(data.meetups, { id: meetupId })),
    // }),
    comments: () => data.comments
  },
  Mutation: {
    addComment: (_, { type, user, message, files }) => {
      console.log('new comment:', type, user, message);
      const newComment = {
        id: data.comments.length + 1,
        type,
        user,
        message
      };

      if (files) {
        // console.log(files);
        // files.forEach((image, index) => {
        //   console.log(image);
        //   console.log(`Image ${index} is ${image.size} bytes`);
        // });

        newComment.upload = files.map(image => image.path); // TODO: image object
      }

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

module.exports = resolvers;
