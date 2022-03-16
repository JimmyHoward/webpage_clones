import mongoose from 'mongoose';
import Post from '../../client/src/components/Posts/Post/Post.js';
import PostMessage from '../models/postMessages.js';

export const getPosts = async (req, res) => {
	try {
		const postMessage = await PostMessage.find();
		res.status(200).json(postMessage);
	} catch (err) {
		res.status(200).json({ message: err.message });
	}
};

export const createPost = async (req, res) => {
	const post = req.body;

	//add new obj to PostMessage model
	const newPost = new PostMessage(post);

	try {
		await newPost.save();
		res.status(201).json(newPost);
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};

export const updatePost = async (req, res) => {
	const { id } = req.params;
	const post = req.body;
	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that ID');
	const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
	res.json(updatedPost);
};

export const deletePost = async (req, res) => {
	const { id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that ID');
	await PostMessage.findByIdAndRemove(id);
	res.json({ message: 'Post deleted successfully' });
};

export const likePost = async (req, res) => {
	const { id } = req.params;
	const post = await PostMessage.findById(id);
	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that ID');
	const updatedPost = await PostMessage.findByIdAndUpdate(
		id,
		{ likeCount: post.likeCount + 1 },
		{ new: true }
	);
	res.json(updatedPost);
};
