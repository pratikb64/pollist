
## What is Pollist?

Pollist is a portal where users can create and host polls for FREE. They can also embed the polls on their website with a simple link.

## Why does Pollist exists?

Creating polls shouldn't be hard, and it also shouldn't be heavy on your website if you embed them in yours. Pollist uses modern Tech Stack and features like [SSR](https://www.educative.io/answers/what-is-server-side-rendering), [CSS purging](https://purgecss.com/), etc., to make every poll lightweight and slick helping users easily create polls that they want

## Glimpses of Pollist

### Homepage
![Homepage](https://cdn.hashnode.com/res/hashnode/image/upload/v1659288575233/qzv6BGLIj.png)

### User Profile Page
![Profile page](https://cdn.hashnode.com/res/hashnode/image/upload/v1659288606577/wEDQIrTCr.png)

### Dashboard
![Dashboard](https://cdn.hashnode.com/res/hashnode/image/upload/v1659288612582/f5cYHuERK.png)

### Poll creation page
![Create poll](https://cdn.hashnode.com/res/hashnode/image/upload/v1659288623374/j1e8cwBoM.png)

### Poll page
![Poll page](https://cdn.hashnode.com/res/hashnode/image/upload/v1659288632026/WWYYx9ej4.png)

### Poll analysis page
![Poll Analysis page](https://cdn.hashnode.com/res/hashnode/image/upload/v1659288640948/507EfZrIL.png)
## Tech Stack, Tools, and Libraries

To make sure Pollist is fast and scalable, it houses technologies such as :

- **[Next.js](https://nextjs.org/)** - For optimized frontend and backend
- **[Typescript](https://www.typescriptlang.org/)** - To keep me sane and Pollist's code maintainable
- **[TailwindCSS](https://tailwindcss.com/)** - To give Pollist it's sexy looks
- **[PlanetScale Database](https://planetscale.com/)** - To store Pollist data
- **[Prisma ORM](https://www.prisma.io/)** - To easily integrate the Database into the Pollist backend
- **[Prettier](https://prettier.io/)** - To make Pollist's code readable and maintainable
- **[Vercel](https://vercel.com/)** - To host Pollist's frontend and backend

## Features list

- **UNLIMITED and FREE poll**

Users can create any number of polls, all for free.

- **Hosted links for all polls**

To ensure your polls are accessible to everyone worldwide, we host them on our website with unique publicly accessible links.

- **Ability to control when the poll is live or hidden**

Toggle individual poll's visibility from its very own editing page

- **Embeddable links**

This gives you the ability to embed polls on any website.

- **Analytics for each poll**

See how many users your poll reached and how many.

## Development highlights of Pollist

- **Loading animation**

[Nprogress](https://ricostacruz.com/nprogress/) was a big help for easily adding loading animation, by simply adding 5 lines loading animation was done

```js
import nProgress from "nprogress";
import "../styles/nprogress.css";

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);
```

- **Querying database**

For querying the database I used [Prisma](https://www.prisma.io/) . Prisma makes interacting with database feel like a breeze, getting user’s data from database becomes something like this

```js
await prisma.user.findFirst({
          where: {
            id: session.user_id,
          },
          select: {
            email: true,
            name: true,
            id: true,
     },
});
```


- **[superjson](https://www.npmjs.com/package/superjson)**

Next.js does not support Date, sets, etc. by default but using this "super" package you can easily overcome this limitation 

## Code quality and maintainability

### Typescript is 💖

Pollist's codebase is secure with type checking using interfaces when and where needed (which is almost everywhere). All variables and functions have a proper naming conviction, making them understandable and easy to edit. I tried to keep it easy so that even beginners could understand the code. 

Typescript saved me many hours of debugging, trust me on this, learning Typescript is soo worth the time if you are still using JavaScript for your projects

### API versioning

Pollist's APIs are versioned, so creating/modifying APIs and integrating them into the system becomes painless. In the future making polls accessible through APIs is also possible using this system.

### Module Resolution

Using non-relative module resolution for `@components`, `@utils`, and `@types`, code automatically becomes clean, from having code like this

```js
import x from "../../../components/x"
import y from "../../../components/y"
import z from "../../../components/z"
```

to something clean and simple like

```js
import { x, y, z } from "@components"
```

Setup module resolution in your project by simply adding these lines in your tsconfig.js file

```js
{
 // rest of tsconfig
"baseUrl": "./",
    "paths": {
      "@components": ["src/components"],
      "@utils": ["src/utils"],
      "@types": ["src/types"]
    }
}

```

## Useful Links

1. [Live preview](https://pollist.pratikbadhe.com/)
2. [GitHub repo](https://github.com/pratikb64/pollist)

## Things that can be added in the future

1. Custom styles for poll
2. Managing Polls using API
3. Custom poll url
4. Poll Description
5. Header images

## My social media accounts

Follow me on [Twitter](https://twitter.com/pratikb64) and [LinkedIn](https://www.linkedin.com/in/pratikbadhe/), and I am soon going to start writing technical blog's on my personal [blog](https://pratikbadhe.com/)

## Conclusion

Lastly, I would like to thank [Hashnode](https://hashnode.com/) and [PlanetScale](https://planetscale.com/) for hosting this hackathon which encouraged me to build this project. Let me know in the comments what you all think about this project.
