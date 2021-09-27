# NEAR assemblyscript kickstart

This readme explains some topics and concepts to to fasten the learn curve for developer which are not yet familiar with NEAR development.

## View/Change functions

There are two ways to call a function of a near contract:

- **View Function (readyonly)**
A view function doesn't require an account and the caller don't pay gas costs for the execution.
If the function contains any write operations, context-variables or special operations like RNG, a view call  errors with the reason "ProhibitedInView".
<br />
- **Change Function**
A change function requires an account and attached gas for the execution.
If the attached gas is not enough to pay the execution, the transaction will error with the reason "Exceeded the prepaid gas.".

More details at: <https://docs.near.org/docs/develop/contracts/as/intro#view-and-change-functions>

## Fullaccess key vs Functioncall key

NEAR is based on an account system for their wallets, all mainnet wallets end with ".near".
For each wallet initially is a fullaccess keypair created.

More details at: <https://vitalpoint.ai/understanding-near-keys>

## Gas Costs

## NEAR-AS-SDK Collection Types (Persistent*-classes)

The near blockchain provides a key-value store for data storage, this means native arrays/maps are not supported. To handle that near-sdk-as provides wrapper classes which imitate the behavior of common needed collections.

### Example

```typescript
let map = new PersistentMap<string, string>("pmap");

map.set("foo1", "bar1");
map.set("foo2", "bar2");
```

This creates two key-value entries on the blockchain with pmap as prefix:  
pmap::foo1 -> "bar1"  
pmap::foo2 -> "bar2"

More details at: <https://docs.near.org/docs/concepts/data-storage>

**Important points**

- It's very important not to mix up the collection prefix when working with several persistent collections.
- Persistent*-classes are not an actual datatype, they give you an instance of a collection-wrapper for a certain prefix.
- Blockchain reads/writes costs gas. If you want to read a map with more than 100 (just an example, exact number depends on datastructure) entries at once, you need pagination to avoid hitting the maximal gas limit of 200Tgas (300Tgas for cross contract calls) per Transaction.

## What if I need more complex operations or more storage?

The easiest solution for this is offchain processing and offchain storage. In the snippet section are two examples about this:

- Offchain storage
- Offchain proceessing

## Timed Tasks

It's not natively possible to schedule function executions on near protocol. So if you have an usecase like: Do something, wait 30 minutes and then do something additionally, that's not possible just within the contract.

There are two workarounds for this:

- Pseudo schedulded: Define a second function the user need to execute another transaction to execute the "timed task" and set a timestamp when the user is eligle to call the second method.
- Cronjob like solution: For some usecases the first way doesn't fit. For more complex scenarios or real scheduled tasks, look into [Croncat].

  [NEAR Accesskeys]: <https://vitalpoint.ai/understanding-near-keys>
  [near-sdk-as introduction + docs]: <https://docs.near.org/docs/develop/contracts/as/intro>
  [Croncat]: <https://www.cron.cat>
