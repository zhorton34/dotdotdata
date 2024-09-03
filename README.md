# DotDotData

<small>

> Complex, deeply nested data is painful. Let's simplify it!
✅ wildcard(`*`) supported dot notation for accessing complex deeply nested data via `data_get`, `data_set`, `data_fill`, & `data_forget`


✅ `tap` for side effects

✅ `retry` for async data fetching

✅ `value` for conditional function execution

✅ `filled` for checking if a value is not blank or empty

✅ `blank` for checking if a value is considered blank or empty

✅ `throw_if` and `throw_unless` for cleaning up try/catch blocks

✅ `optional` for safe access to potentially `null` or `undefined` objects

✅ `transform` for transforming a value if it's not `blank`, otherwise returns a default value

### Usage
```ts
const data = {
  family: {
    children: [{ name: "Sarah" }, { name: "Tom" }, { name: "Anthony" }]
  }
};

data_get("family.children.1.name", data) // "Tom"
data_get("family.children.*.name", data) // ["Sarah", "Tom", "Anthony"]

data_set("family.children.1.name", "Tommy", data) 
data_get("family.children.1.name", data) // "Tommy" 

data_get("family.children.*", data) 
// [{ name: "Sarah" }, { name: "Tommy" }, { name: "Anthony" }]

data_fill("family.children.1.name", "Tommy", data) // ["Sarah", "Tommy", "Anthony"]

data_fill("family.children.3.name", "Andrew", data)
data_get("family.children", data) // // [{ name: "Sarah" }, { name: "Tommy" }, { name: "Anthony" }, { name: "Andrew" }]

data_get("family.children.name.*", data) // ["Sarah", "Tommy", "Anthony", "Andrew"]

data_forget("family.children.1", data)
data_get("family.children", data) // [{ name: "Sarah" }, { name: "Anthony" }, { name: "Andrew" }]

data_forget("family.children.*", data)
data_get("family.children", data) // []
```





## Table of Contents

- [Helper Functions](#helper-functions)
  - [data_get](#data_get)
  - [data_set](#data_set)
  - [data_fill](#data_fill)
  - [data_forget](#data_forget)
  - [optional](#optional)
  - [blank](#blank)
  - [filled](#filled)
  - [transform](#transform)
  - [retry](#retry)
  - [tap](#tap)
  - [throw_if and throw_unless](#throw_if-and-throw_unless)
  - [value](#value)
- [Advanced Usage Examples](#advanced-usage-examples)



## Helper Functions

### data_get

Safely retrieves a value from a nested object or array using dot notation.

```typescript
import { data_get } from "@findhow/dotdotdata";

const data = {
  user: {
    profile: {
      name: "John Doe",
      address: {
        city: "New York"
      }
    },
    posts: [
      { title: "First Post", comments: 5 },
      { title: "Second Post", comments: 3 }
    ]
  }
};

console.log(data_get(data, 'user.profile.name')); // "John Doe"
console.log(data_get(data, 'user.posts.1.title')); // "Second Post"
console.log(data_get(data, 'user.settings.theme', 'default')); // "default"
console.log(data_get(data, 'user.posts.*.comments')); // [5, 3]
```

### data_set

Sets a value in a nested object or array using dot notation, creating intermediate objects/arrays as needed.

```typescript
import { data_set } from "@findhow/dotdotdata";

let user = {};

data_set(user, 'profile.name', 'Jane Doe');
data_set(user, 'settings.notifications.email', true);
data_set(user, 'posts.0.title', 'My First Post');

console.log(user);
// {
//   profile: { name: 'Jane Doe' },
//   settings: { notifications: { email: true } },
//   posts: [{ title: 'My First Post' }]
// }
```

### data_fill

Fills a value in an object if it doesn't exist, without overwriting existing values.

```typescript
import { data_fill } from "@findhow/dotdotdata";

let config = {
  app: {
    name: "MyApp",
    version: "1.0.0"
  }
};

data_fill(config, 'app.debug', true);
data_fill(config, 'app.name', 'NewName'); // Won't overwrite existing value
data_fill(config, 'database.host', 'localhost');

console.log(config);
// {
//   app: {
//     name: "MyApp",
//     version: "1.0.0",
//     debug: true
//   },
//   database: {
//     host: "localhost"
//   }
// }
```

### data_forget

Removes an item from an array or object using dot notation.

```typescript
import { data_forget } from "@findhow/dotdotdata";

let data = {
  user: {
    profile: { name: "John", age: 30 },
    posts: [
      { id: 1, title: "Post 1" },
      { id: 2, title: "Post 2" }
    ]
  }
};

data_forget(data, 'user.profile.age');
data_forget(data, 'user.posts.0');

console.log(data);
// {
//   user: {
//     profile: { name: "John" },
//     posts: [{ id: 2, title: "Post 2" }]
//   }
// }
```

### optional

Provides safe access to properties of potentially null or undefined objects.

```typescript
import { optional } from "@findhow/dotdotdata";

const user = null;
console.log(optional(user)?.name?.toUpperCase()); // undefined (no error thrown)

const validUser = { name: "Alice", getAge: () => 25 };
console.log(optional(validUser).name); // "Alice"
console.log(optional(validUser).getAge?.()); // 25
```

### blank

Checks if a value is considered blank or empty.

```typescript
import { blank } from "@findhow/dotdotdata";

console.log(blank("")); // true
console.log(blank(null)); // true
console.log(blank(undefined)); // true
console.log(blank([])); // true
console.log(blank({})); // true
console.log(blank(0)); // false
console.log(blank(false)); // false
```

### filled

Checks if a value is not blank or empty.

```typescript
import { filled } from "@findhow/dotdotdata";

console.log(filled("Hello")); // true
console.log(filled([1, 2, 3])); // true
console.log(filled({ key: "value" })); // true
console.log(filled("")); // false
console.log(filled(null)); // false
```

### transform

Transforms a value if it's not blank, otherwise returns a default value.

```typescript
import { transform } from "@findhow/dotdotdata";

const result1 = transform("hello", (str) => str.toUpperCase());
console.log(result1); // "HELLO"

const result2 = transform("", (str) => str.toUpperCase(), "DEFAULT");
console.log(result2); // "DEFAULT"

const result3 = transform(null, (val) => val * 2, () => "COMPUTED DEFAULT");
console.log(result3); // "COMPUTED DEFAULT"
```

### retry

Attempts to execute a callback until it succeeds or the maximum attempt count is reached.

```typescript
import { retry } from "@findhow/dotdotdata";

const fetchData = async () => {
  const response = await fetch('https://api.example.com/data');
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};

try {
  const data = await retry(fetchData, 3, 1000);
  console.log(data);
} catch (error) {
  console.error("All attempts failed:", error);
}
```

### tap

Passes the value to a callback function and returns the original value, useful for performing side effects.

```typescript
import { tap } from "@findhow/dotdotdata";

const result = [1, 2, 3, 4, 5]
  .map(n => n * 2)
  .tap(arr => console.log("Doubled array:", arr))
  .filter(n => n > 5);

console.log(result); // [6, 8, 10]
```

### throw_if and throw_unless

Throw exceptions based on conditions.

```typescript
import { throw_if, throw_unless } from "@findhow/dotdotdata";

function processAge(age: number) {
  throw_if(age < 0, Error, "Age cannot be negative");
  throw_unless(age >= 18, Error, "Must be at least 18 years old");
  console.log("Age processed successfully");
}

try {
  processAge(20); // Age processed successfully
  processAge(15); // Throws: Error: Must be at least 18 years old
  processAge(-5); // Throws: Error: Age cannot be negative
} catch (error) {
  console.error(error);
}
```

### value

Returns the value if it's not a function, otherwise calls the function and returns its result.

```typescript
import { value } from "@findhow/dotdotdata";

console.log(value(5)); // 5
console.log(value(() => 10)); // 10

const config = {
  debug: true,
  logLevel: () => process.env.LOG_LEVEL || 'info'
};

console.log(value(config.debug)); // true
console.log(value(config.logLevel)); // 'info' (assuming process.env.LOG_LEVEL is not set)
```

## Advanced Usage Examples

### Comprehensive Example: Managing a Library System

Let's walk through a scenario of managing a library system using our helper functions. This example will demonstrate how these functions can simplify complex data operations.

```typescript
import { data_get, data_set, optional, transform } from "@findhow/dotdotdata";

const complexData = {
  users: [
    { id: 1, name: "Alice", details: { age: 30, city: "New York" } },
    { id: 2, name: "Bob", details: null },
    { id: 3, name: "Charlie" }
  ],
  settings: {
    theme: "dark",
    notifications: {
      email: true,
      push: false
    }
  }
};

// Safely access nested properties
const aliceCity = data_get(complexData, 'users.0.details.city', 'Unknown');
console.log(aliceCity); // "New York"

const bobAge = data_get(complexData, 'users.1.details.age', 'N/A');
console.log(bobAge); // "N/A"

// Use optional chaining for nullable objects
const bobDetails = optional(complexData.users[1].details);
console.log(bobDetails?.age); // undefined (no error thrown)

// Transform data safely
const userCities = complexData.users.map(user => 
  transform(user.details, details => details.city, 'Unknown')
);
console.log(userCities); // ["New York", "Unknown", "Unknown"]

// Modify nested data
data_set(complexData, 'users.1.details', { age: 25, city: "London" });
data_set(complexData, 'settings.notifications.sms', true);

console.log(complexData.users[1].details); // { age: 25, city: "London" }
console.log(complexData.settings.notifications); // { email: true, push: false, sms: true }
```
</small>


### Simple Examples

#### data_get

```typescript
import { data_get } from "@findhow/dotdotdata";

const data = {
  user: {
    profile: {
      name: "John Doe",
      address: {
        city: "New York"
      }
    },
    posts: [
      { title: "First Post", comments: 5 },
      { title: "Second Post", comments: 3 }
    ]
  }
};

data_get(data, 'user.profile.name'); // "John Doe"
data_get(data, 'user.posts.1.title'); // "Second Post"
data_get(data, 'user.settings.theme', 'default'); // "default"
data_get(data, 'user.posts.*.title'); // ["First Post", "Second Post"]
```

#### data_set

```typescript
import { data_set } from "@findhow/dotdotdata";

let user = {};

data_set(user, 'profile.name', 'Jane Doe');
data_set(user, 'settings.notifications.email', true);
data_set(user, 'posts.0.title', 'My First Post');
data_set(user, 'posts.1.title', 'My Second Post');
console.log(user);
// {
//   profile: { name: 'Jane Doe' },
//   settings: { notifications: { email: true } },
//   posts: [{ title: 'My First Post' }, { title: 'My Second Post' }]
// }

// data_set wildcard
data_set(user, 'posts.*.title', 'Wildcard Post');
console.log(user); 
// {
//   profile: { name: 'Jane Doe' },
//   settings: { notifications: { email: true } },
//   posts: [{ title: 'Wildcard Post' }, { title: 'Wildcard Post' }]
// }
```

#### data_fill

```typescript
import { data_fill } from "@findhow/dotdotdata"; 

let config = {
  app: {
    name: "MyApp",
    version: "1.0.0"
  }
};

data_fill(config, 'app.debug', true);
data_fill(config, 'app.name', 'NewName'); // Won't overwrite existing value
data_fill(config, 'database.host', 'localhost');

console.log(config);
// {
//   app: {
//     name: "MyApp",
//     version: "1.0.0",
//     debug: true
//   },
//   database: {
//     host: "localhost"
//   }
// }
``` 

#### data_forget

```typescript
import { data_forget } from "@findhow/dotdotdata";

let data = {
  user: {
    profile: { name: "John", age: 30 },
    posts: [
      { id: 1, title: "Post 1" },
      { id: 2, title: "Post 2" }
    ]
  }
};

data_forget(data, 'user.profile.age');
data_forget(data, 'user.posts.0');
console.log(data);
// {
//   user: {
//     profile: { name: "John" },
//     posts: [{ id: 2, title: "Post 2" }]
//   }
// }
``` 

#### optional

```typescript
import { optional } from "@findhow/dotdotdata";

const user = null;
console.log(optional(user)?.name?.toUpperCase()); // undefined (no error thrown)

const validUser = { name: "Alice", getAge: () => 25 };
console.log(optional(validUser).name); // "Alice"
console.log(optional(validUser).getAge?.()); // 25
```


