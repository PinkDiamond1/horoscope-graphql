# Horoscope GraphQL
This repository defines AWS Lambda Function to be used as a Resolver for AWS AppSync (HoroscopeGraphQL - GraphQL API Service). HoroscopeGraphQL provides queries to Horoscope's DocumentDB, which is used to store data of several Cosmos-based Networks (including Aura Network).

## How it works
We create a GraphQL schema and provision a Lambda function that enables us to connect to Amazon DocumentDB as a data source. We can then run AWS AppSync queries to retrieve data from Horoscope's Amazon DocumentDB.
![image](docs/images/dbblog_922_01.jpg)

## Deployment guide
### I. Create Lambda Function
The whole repository is being zipped and uploaded to Lambda Function's Code source.

#### 1. Access AWS Lambda Service and click on `Create function`.
![image](docs/images/create-lambda-function.png)

#### 2. In the create function step, choose `Author from scratch` and configure some information for your function.
![image](docs/images/configure-lambda-function.png)
- **Change default execution role:** you need to have a role with basic Lambda permissions.
![image](docs/images/aws-role.png) 
- **Enable VPC:** you have to connect your function with Horoscope's DocumentDB by adding Lambda Function to the same VPC as the DocumentDB.
![image](docs/images/add-vpc.png)
After the configuration step is finished, click on `Create function`.

#### 3. Wait until your function is created, then choose upload from .zip file and upload this project's zip file
![image](docs/images/upload-zip.png)

### II. Set up AWS AppSync
Follow the AWS guideline [here](https://aws.amazon.com/blogs/database/build-a-graphql-api-for-amazon-documentdb-with-mongodb-compatibility-using-aws-appsync/) to set up AWS AppSync Service (Start from the step `Set up AWS AppSync`).

After setting up AWS AppSync Service and providing the Lambda Function as its Resolvers, your service is good to go.