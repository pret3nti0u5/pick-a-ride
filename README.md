# Pick-A-Ride

## Tech Stack (A ride sharing platform)

### Listed below are the technologies used in this project, along with their purpose.

- **Next.js** - Allows for server-side rendering while still using React, which allows for a faster initial load time, and better SEO. Moreover, it allows me to create api routes, which I use to fetch data from the database, which saves from the hassle of having to Node.js and Express.js to create a backend.

- **NextAuth.js** - Allows for easy authentication with Google, Facebook, Twitter, and other providers. It also allows for easy access to the user's information, such as their name, email, and profile picture. This is how I have implemented authentication in this project.

- **MongoDB** - A NoSQL database that allows for easy storage of data in JSON format. It is also very easy to use with Node.js, as it has a Node.js driver.

- **Prisma** - An ORM that allows for easy access to the database. Along with this it allows me to use relational data even though I am using a NoSQL database.

[Removed following libraries as I couldn't get them to work due to a payment issue]

- **Places API** - Allows for easy access to the Google Places API, which allows for easy access to the Google Maps API. This is how I have implemented the autocomplete feature in this project.

- **Maps JavaScript API** - Allows for easy access to the Google Maps API, which allows for easy access to the Google Places API. This is how I have implemented the autocomplete feature in this project.

- **Directions API** - Allows for easy access to the Google Directions API, which allows for easy access to the Google Maps API. This is how I have implemented the autocomplete feature in this project.

## Future Improvements for scalability

- **Amazon SNS and SQS** - Amazon SNS and SQS can be used for implementing a notification system. SNS would be used to send out notifications on certain events using a seperate service which will keep track of user geolocation and ride status.

  A seperate service which would use SQS could then be used to process incoming notifications and send it to another service which would then send out notifications to specific users.

  We did a similar implementation during my time at Amazon when we wanted to Enable Offline Pickup from Lockers.

- **Amazon ECS** - Each of the service described above can be deployed as a seperate container using Amazon ECS. This would allow for easy scaling of the application, as it would be easy to deploy multiple instances of the application.

- **ElasticSearch** - ElasticSearch can be used to implement a search feature, which along with Places API would return results which have their origin and destination under a given radius (say 5 KMs) from the user's inputted origin and destination.

- **Redis** - Redis can be used to implement a caching layer, which would cache the results of the search feature. This would allow for faster results, as the results would be fetched from the cache instead of the database.

- **Docker** - Allows for easy containerization of the application, which allows for easy deployment to a cloud platform such as AWS, Azure, or Google Cloud. This would allow for easy scaling of the application, as it would be easy to deploy multiple instances of the application. Moreover, would simplify the development process, as it would be easy to set up the development environment.
