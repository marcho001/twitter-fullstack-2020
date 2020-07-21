const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetController = {
    getTweets: (req, res) => {
      return res.render('tweetsHome')
    },
    getTweet: async (req, res) => {
      const id = req.params.id
      const tweet = await Tweet.findOne({
        where: { id },
        include: [
          User, 
          { model: User, as: 'whoReply'}
        ]
      })
      const totalLike = await Like.count({
        where: { UserId: id }
      })
      
      const totalComment = tweet.toJSON().whoReply.length

      const totalCount = {
        totalLike, totalComment
      }
      console.log(tweet.toJSON())
      console.log(tweet.toJSON().whoReply)
      res.render('tweet',{ tweet: tweet.toJSON(), totalCount })
    }
  }
  module.exports = tweetController