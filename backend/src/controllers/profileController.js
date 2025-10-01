import User from '../models/User.js';

// Get current user's profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(user.toJSON());
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile by ID
export const getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Check if profile is public or if it's the user's own profile
    if (!user.isPublic && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'This profile is private' });
    }

    res.json(user.toJSON());
  } catch (error) {
    console.error('Get profile by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      major,
      year,
      currentInternship,
      previousInternships,
      skills,
      interests,
      bio,
      linkedIn,
      isPublic,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (major !== undefined) user.major = major;
    if (year !== undefined) user.year = year;
    if (currentInternship !== undefined) user.currentInternship = currentInternship;
    if (previousInternships !== undefined) user.previousInternships = previousInternships;
    if (skills !== undefined) user.skills = skills;
    if (interests !== undefined) user.interests = interests;
    if (bio !== undefined) user.bio = bio;
    if (linkedIn !== undefined) user.linkedIn = linkedIn;
    if (isPublic !== undefined) user.isPublic = isPublic;

    const updatedUser = await user.save();

    res.json(updatedUser.toJSON());
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all public profiles
export const getAllProfiles = async (req, res) => {
  try {
    const users = await User.find({ 
      isPublic: true,
      _id: { $ne: req.user._id } // Exclude current user
    }).select('-password');

    res.json(users);
  } catch (error) {
    console.error('Get all profiles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search profiles
export const searchProfiles = async (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    let searchQuery = { 
      isPublic: true,
      _id: { $ne: req.user._id }
    };

    // Build search query based on filter type
    switch (type) {
      case 'name':
        searchQuery.name = { $regex: q, $options: 'i' };
        break;
      case 'major':
        searchQuery.major = { $regex: q, $options: 'i' };
        break;
      case 'internship':
        searchQuery.$or = [
          { currentInternship: { $regex: q, $options: 'i' } },
          { previousInternships: { $regex: q, $options: 'i' } },
        ];
        break;
      default:
        // Default: search across multiple fields
        searchQuery.$or = [
          { name: { $regex: q, $options: 'i' } },
          { major: { $regex: q, $options: 'i' } },
          { currentInternship: { $regex: q, $options: 'i' } },
          { previousInternships: { $regex: q, $options: 'i' } },
          { skills: { $regex: q, $options: 'i' } },
          { interests: { $regex: q, $options: 'i' } },
        ];
    }

    const users = await User.find(searchQuery).select('-password');

    res.json(users);
  } catch (error) {
    console.error('Search profiles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
