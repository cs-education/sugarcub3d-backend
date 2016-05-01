Sugarcub3d API/Back-end Documentation

**Images of Example Request and Response don't show here. See official documentation**


https://wiki.cites.illinois.edu/wiki/display/CSFPSPSS/Sugarcub3d+API+Documentation?src=contextnavpagetreemode#


Background: The Sugar Sugar (Sugarcub3d) 3D food printer allows for 3D printing of food in the form of Nutella, cupcake frosting, or pudding (tested so far as of March 6th) as basic shapes such as letters of the alphabet, numbers, and simple flat designs. These shapes will be “printed” onto cookies that will be served to participants after they play a game that helps expose them to computer science and basic principles of programming. The shapes that the team has decided to focus on printing are the standard letters of the alphabet, representative of the initials of the name of a participant.
	A web application powers the game that participants will play to print their own cookie. The game consists of questions that participants will attempt to answer, with the reward for completion being a cookie upon which we will 3D print the participant's initials on. 
	For this web application, we are using a backend solution to create, store, update, and read questions, as well as track user interaction with the game by recording user’s basic information and their game performance. We created a RESTful API that allows for retrieval, modification, and creation of questions, users, and their performance records that is served by our web server.

Technology stack: MEAN
Base URL (no content at base): https://mysterious-caverns-36769.herokuapp.com
Web server: Node.js
Database: MongoDB hosted by MLab (https://mlab.com/databases/sugarcub3d)
Deployment platform: Heroku

API Documentation:

Question: Represents a single question that can be either a multiple choice question (MC) or an IDE output question. MC questions have 4 possible answer choices (but only one correct choice) while IDE output questions have no fixed answer choices and rather are open-end type questions where the user supplies the answer to check against.

Schema:

Endpoints:

/api/questions

Usage: Base URL + /api/questions

GET: Return list of questions as well as status message indicating response success/failure and a standard HTTP status.

Query params: 
random: Get random unordered list of questions
where: Specify where conditions (see MongoDB docs)
select: Retrieve only certain fields
skip: Skip over some question in returned list
limit: Number of questions to return back in list

Example Request (with some query params):

**GET: https://mysterious-caverns-36769.herokuapp.com/api/questions?random=true&limit=3**

**POST: Create a new question or update an existing question (if title of question matches existing one).**
HTTP request includes body (standard for POST)
POST: https://mysterious-caverns-36769.herokuapp.com/api/questions/ 


/api/questions/:id

**GET: Get a question with id specified by the URL parameter id.**

Example request: https://mysterious-caverns-36769.herokuapp.com/api/questions/56e2992a36b7472100019def


**DELETE: Delete a question with id specified by the URL parameter id.**

Example request:
https://mysterious-caverns-36769.herokuapp.com/api/questions/56e2992a36b7472100019def

**PUT: Update a question with id specified by the URL parameter id. If question does not exist, return HTTP 404.**

Example request:
https://mysterious-caverns-36769.herokuapp.com/api/questions/56e2992a36b7472100019def

User: Represents a user of the game.


Endpoints: /api/users

Usage: Base URL + /api/users

**GET: Return a list of active users (users who have played the game at least once).**

Query params: 
random: Get random unordered list of questions
where: Specify where conditions (see MongoDB docs)
select: Retrieve only certain fields
skip: Skip over some question in returned list
limit: Number of questions to return back in list

Example Request (with some query params):

**GET: https://mysterious-caverns-36769.herokuapp.com/api/users?limit=1**

**POST: Create a new user or update an existing user**

/api/users/:id

Follows similar request and response structure as questions/:id.

Question Record: An object containing useful information about a user’s session within a game, such as their time taken to answer questions, number of attempts, etc.



Endpoints follow similar structure to that of users and questions.
/api/questionRecords allows for creating new question records, retrieving a list of question records filtered according to query parameters.

/api/questionRecords/:id allow for retrieving an individual question record specified by the URL parameter id, deleting a specific question, and updating a specific question.
