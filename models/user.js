'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.STRING,
    role: DataTypes.STRING,
    account: DataTypes.STRING,
    cover: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Tweet)  
    User.hasMany(models.Reply)
    User.hasMany(models.Like)   
    User.hasMany(models.ChatMessage) 
    
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    });  
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })

    User.belongsToMany(models.Reply, {
      through: models.RepliesLikes,
      foreignKey: 'UserId',
      as: 'UserLikesReply'
    })

    User.belongsToMany(User, {
      through: models.privatemassage,
      foreignKey: 'SenderId',
      as: 'RecipientId'
    })

    User.belongsToMany(User, {
      through: models.privatemassage,
      foreignKey: 'RecipientId',
      as: 'SenderId'
    })
  };
  return User;
};
