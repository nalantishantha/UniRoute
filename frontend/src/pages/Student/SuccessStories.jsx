import React, { useState } from "react";
import { Link } from "react-router-dom";
import StudentNavigation from "../../components/Navigation/StudentNavigation";
import {
  Search,
  Heart,
  MessageCircle,
  Share2,
  Award,
  Users,
  Star,
  Calendar,
  MapPin,
  BookOpen,
  Quote,
} from "lucide-react";

const SuccessStories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [likedStories, setLikedStories] = useState(new Set());

  const stories = [
    {
      id: 1,
      name: "Kasun Perera",
      currentRole: "Software Engineer at Google",
      university: "University of Moratuwa",
      degree: "Computer Science and Engineering",
      graduationYear: 2020,
      category: "Technology",
      image: "/api/placeholder/150/150",
      story:
        "From a small village in Matara, I never imagined I would work at Google. The journey started at University of Moratuwa where I discovered my passion for algorithms and machine learning. The key was consistent practice on coding platforms and participating in hackathons.",
      achievements: [
        "Google Summer of Code 2019",
        "ACM-ICPC Regional Finals",
        "Dean's List for 4 consecutive semesters",
      ],
      advice:
        "Never underestimate the power of consistent learning. Start coding early, contribute to open source, and never stop asking questions.",
      location: "Mountain View, California",
      likes: 234,
      comments: 45,
      shares: 12,
      featured: true,
      type: "text",
    },
    {
      id: 2,
      name: "Dr. Nimesha Fernando",
      currentRole: "Cardiac Surgeon",
      university: "University of Colombo",
      degree: "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
      graduationYear: 2015,
      category: "Medicine",
      image: "/api/placeholder/150/150",
      story:
        "Medicine was my calling from childhood. The rigorous training at University of Colombo shaped me into the doctor I am today. Specializing in cardiac surgery was challenging, but the ability to save lives makes every sacrifice worthwhile.",
      achievements: [
        "Specialized in Cardiac Surgery",
        "Published 15 research papers",
        "Performed 200+ successful surgeries",
      ],
      advice:
        "Medicine requires dedication and compassion. Never lose sight of why you chose this path - to heal and serve others.",
      location: "National Hospital of Sri Lanka",
      likes: 189,
      comments: 67,
      shares: 23,
      featured: true,
      type: "text",
    },
    {
      id: 3,
      name: "Amaya Wickramasinghe",
      currentRole: "CEO & Founder of EcoTech Solutions",
      university: "University of Sri Jayewardenepura",
      degree: "Business Administration",
      graduationYear: 2018,
      category: "Business",
      image: "/api/placeholder/150/150",
      story:
        "I started my sustainability-focused tech company right after graduation. University taught me the fundamentals of business, but real learning happened when I took the leap into entrepreneurship. Today, we're solving environmental challenges across South Asia.",
      achievements: [
        "Founded company valued at $2M",
        "Featured in Forbes 30 Under 30",
        "Raised $500K in Series A funding",
      ],
      advice:
        "Don't wait for the perfect moment to start. Take calculated risks, learn from failures, and surround yourself with people who believe in your vision.",
      location: "Colombo, Sri Lanka",
      likes: 312,
      comments: 89,
      shares: 34,
      featured: false,
      type: "text",
    },
    {
      id: 4,
      name: "Prof. Rajitha Bandara",
      currentRole: "Research Scientist at CERN",
      university: "University of Peradeniya",
      degree: "Physics",
      graduationYear: 2012,
      category: "Science",
      image: "/api/placeholder/150/150",
      story:
        "Physics fascinated me since school. After completing my undergraduate degree at Peradeniya, I pursued PhD at Cambridge. Now I'm part of groundbreaking research at CERN, contributing to our understanding of the universe.",
      achievements: [
        "PhD from Cambridge University",
        "Published in Nature Physics",
        "Part of Higgs Boson discovery team",
      ],
      advice:
        "Pure sciences require patience and persistence. Don't be discouraged by complex concepts - every great discovery started with curiosity.",
      location: "Geneva, Switzerland",
      likes: 156,
      comments: 28,
      shares: 15,
      featured: false,
      type: "text",
    },
    {
      id: 5,
      name: "Sandali Rathnayake",
      currentRole: "Senior Architect",
      university: "University of Moratuwa",
      degree: "Architecture",
      graduationYear: 2017,
      category: "Architecture",
      image: "/api/placeholder/150/150",
      story:
        "Architecture is where art meets engineering. My time at Moratuwa taught me to balance creativity with technical precision. I've designed sustainable buildings across Asia, focusing on climate-responsive architecture.",
      achievements: [
        "Green Building Council Award",
        "Designed 50+ sustainable buildings",
        "TEDx speaker on sustainable architecture",
      ],
      advice:
        "Architecture is about creating spaces that improve lives. Always consider the environmental and social impact of your designs.",
      location: "Singapore",
      likes: 198,
      comments: 41,
      shares: 19,
      featured: false,
      type: "text",
    },
    {
      id: 6,
      name: "Chathura Silva",
      currentRole: "International Law Consultant",
      university: "University of Colombo",
      degree: "Bachelor of Laws (LLB)",
      graduationYear: 2016,
      category: "Law",
      image: "/api/placeholder/150/150",
      story:
        "Law school at University of Colombo opened my eyes to justice and human rights. After gaining experience in Sri Lanka, I specialized in international arbitration. Now I represent countries in international disputes.",
      achievements: [
        "Master's from Harvard Law School",
        "Argued 20+ international cases",
        "UN Human Rights Commission consultant",
      ],
      advice:
        "Law is about serving justice. Stay updated with global legal trends and never compromise on ethical principles.",
      location: "The Hague, Netherlands",
      likes: 167,
      comments: 33,
      shares: 8,
      featured: false,
      type: "text",
    },
  ];

  const categories = [
    { id: "all", name: "All Stories" },
    { id: "Technology", name: "Technology" },
    { id: "Medicine", name: "Medicine" },
    { id: "Business", name: "Business" },
    { id: "Science", name: "Science" },
    { id: "Architecture", name: "Architecture" },
    { id: "Law", name: "Law" },
  ];

  const filteredStories = stories
    .filter(
      (story) =>
        selectedCategory === "all" || story.category === selectedCategory
    )
    .filter(
      (story) =>
        story.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.currentRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.degree.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const featuredStories = filteredStories.filter((story) => story.featured);
  const regularStories = filteredStories.filter((story) => !story.featured);

  const toggleLike = (storyId) => {
    const newLikedStories = new Set(likedStories);
    if (likedStories.has(storyId)) {
      newLikedStories.delete(storyId);
    } else {
      newLikedStories.add(storyId);
    }
    setLikedStories(newLikedStories);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-50 to-white">
      {/* Navigation */}
      <StudentNavigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-5xl text-blue-900 mb-4 drop-shadow-md">
            Success Stories
          </h1>
          <p className="text-xl text-blue-800 max-w-3xl mx-auto">
            Be inspired by the journeys of our alumni who have achieved
            remarkable success in their careers. Learn from their experiences
            and discover your own path to greatness.
          </p>
        </div>
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-600" />
              <input
                type="text"
                placeholder="Search by name, role, university, or degree..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-blue-900 placeholder-blue-600"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">
              {stories.length}
            </div>
            <div className="text-blue-700">Success Stories</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200 text-center">
            <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">50+</div>
            <div className="text-blue-700">Industries</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200 text-center">
            <MapPin className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">25+</div>
            <div className="text-blue-700">Countries</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">95%</div>
            <div className="text-blue-700">Employment Rate</div>
          </div>
        </div>

        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display font-semibold text-3xl text-blue-900 mb-8">
              Featured Stories
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredStories.map((story) => (
                <div
                  key={story.id}
                  className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl text-white overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <Star className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-2xl">
                          {story.name}
                        </h3>
                        <p className="opacity-90">{story.currentRole}</p>
                      </div>
                    </div>
                    <Quote className="h-8 w-8 mb-4 opacity-60" />
                    <p className="text-lg leading-relaxed mb-6 opacity-90">
                      {story.story}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm opacity-80">
                        <div>{story.university}</div>
                        <div>
                          {story.degree} • {story.graduationYear}
                        </div>
                      </div>
                      <div className="bg-white/20 px-4 py-2 rounded-lg">
                        <span className="text-sm font-medium">Featured</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Stories */}
        <div className="space-y-6">
          {regularStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-2/3">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-xl text-blue-900 mb-1">
                          {story.name}
                        </h3>
                        <p className="text-blue-700 mb-2">
                          {story.currentRole}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-blue-700">
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{story.university}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{story.graduationYear}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{story.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-blue-700 mb-4 leading-relaxed">
                      {story.story}
                    </p>

                    <div className="mb-4">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Key Achievements
                      </h4>
                      <ul className="space-y-1">
                        {story.achievements.map((achievement, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <Award className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-blue-700 text-sm">
                              {achievement}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center space-x-2">
                        <Quote className="h-4 w-4" />
                        <span>Advice for Students</span>
                      </h4>
                      <p className="text-blue-700 italic">
                        "{story.advice}"
                      </p>
                    </div>
                  </div>

                  <div className="lg:w-1/3">
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-blue-900 mb-3">
                        Education Background
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <div className="text-blue-700">Degree</div>
                          <div className="font-medium text-blue-900">
                            {story.degree}
                          </div>
                        </div>
                        <div>
                          <div className="text-blue-700">University</div>
                          <div className="font-medium text-blue-900">
                            {story.university}
                          </div>
                        </div>
                        <div>
                          <div className="text-blue-700">Graduation</div>
                          <div className="font-medium text-blue-900">
                            {story.graduationYear}
                          </div>
                        </div>
                        <div>
                          <div className="text-blue-700">Field</div>
                          <div className="font-medium text-blue-900">
                            {story.category}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-blue-200">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => toggleLike(story.id)}
                      className={`flex items-center space-x-2 transition-colors ${
                        likedStories.has(story.id)
                          ? "text-red-500"
                          : "text-blue-700 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          likedStories.has(story.id) ? "fill-current" : ""
                        }`}
                      />
                      <span>
                        {story.likes + (likedStories.has(story.id) ? 1 : 0)}
                      </span>
                    </button>
                    <button className="flex items-center space-x-2 text-blue-700 hover:text-blue-900 transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span>{story.comments}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-blue-700 hover:text-blue-900 transition-colors">
                      <Share2 className="h-5 w-5" />
                      <span>{story.shares}</span>
                    </button>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {story.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-blue-300 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-2xl text-blue-900 mb-2">
              No Stories Found
            </h3>
            <p className="text-blue-700">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white text-center">
          <h2 className="font-display font-bold text-3xl mb-4">
            Share Your Success Story
          </h2>
          <p className="text-xl opacity-90 mb-6">
            Inspire the next generation of students by sharing your journey and
            achievements.
          </p>
          <button className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            Submit Your Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;
