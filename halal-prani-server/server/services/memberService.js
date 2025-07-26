const Member = require('../models/memberModel');

exports.createMember = async (userId, name, phone, email) => {
  const member = new Member({
    userId,
    name,
    phone,
    email,
  });

  await member.save();
  return member;
};

exports.getMember = async (userId) => {
  const member = await Member.findOne({ userId });
  return member;
};
