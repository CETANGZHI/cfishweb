# CFISH Backend API Documentation

This document provides a comprehensive overview of the CFISH backend API endpoints, including their functionalities, request/response formats, and authentication requirements.

## Table of Contents

1.  [Authentication API](#authentication-api)
2.  [User API](#user-api)
3.  [NFT API](#nft-api)
4.  [Cart API](#cart-api)
5.  [Notification API](#notification-api)
6.  [Comment API](#comment-api)
7.  [IPFS API](#ipfs-api)
8.  [Analytics API](#analytics-api)
9.  [Referral API](#referral-api)
10. [Anti-Brushing API](#anti-brushing-api)

---




## Authentication API

The authentication API handles user login, token refreshing, and logout.

### `POST /api/v1/auth/login`

**Description:** Authenticates a user based on their wallet address and returns access and refresh tokens. If the wallet address does not exist, a new user will be created.

**Rate Limit:** 5 requests per minute.

**Request Body:**

```json
{
  "wallet_address": "string",
  "signature": "string",
  "message": "string"
}
```

**Responses:**

*   **200 OK:**

    ```json
    {
      "access_token": "string",
      "refresh_token": "string",
      "user": {
        "id": "string",
        "wallet_address": "string",
        "username": "string",
        "display_name": "string",
        "email": "string",
        "bio": "string",
        "avatar_url": "string",
        "banner_url": "string",
        "verified": "boolean",
        "followers_count": "integer",
        "following_count": "integer",
        "total_sales": "string",
        "nfts_owned_count": "integer",
        "nfts_created_count": "integer",
        "last_active": "string",
        "status": "string",
        "created_at": "string",
        "updated_at": "string",
        "social_links": {}
      }
    }
    ```

*   **400 Bad Request:**

    ```json
    {
      "message": "Missing wallet_address parameter" // or "Invalid wallet address format"
    }
    ```

### `POST /api/v1/auth/refresh`

**Description:** Refreshes an expired access token using a valid refresh token.

**Authentication:** JWT Refresh Token required.

**Responses:**

*   **200 OK:**

    ```json
    {
      "access_token": "string"
    }
    ```

*   **401 Unauthorized:**

    ```json
    {
      "msg": "Missing Authorization Header" // or "Token has expired"
    }
    ```

### `POST /api/v1/auth/logout`

**Description:** Logs out the current user by invalidating their JWT token.

**Authentication:** JWT Access Token required.

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "Successfully logged out"
    }
    ```

*   **401 Unauthorized:**

    ```json
    {
      "msg": "Missing Authorization Header"
    }
    ```

---




## User API

The User API provides endpoints for retrieving, updating, and managing user profiles, social links, and follow relationships.

### `GET /api/v1/users/<string:user_id>`

**Description:** Retrieves a user's profile information.

**Parameters:**

*   `user_id` (path): The ID of the user to retrieve.

**Responses:**

*   **200 OK:**

    ```json
    {
      "id": "string",
      "wallet_address": "string",
      "username": "string",
      "display_name": "string",
      "email": "string",
      "bio": "string",
      "avatar_url": "string",
      "banner_url": "string",
      "verified": "boolean",
      "followers_count": "integer",
      "following_count": "integer",
      "total_sales": "string",
      "nfts_owned_count": "integer",
      "nfts_created_count": "integer",
      "last_active": "string",
      "status": "string",
      "created_at": "string",
      "updated_at": "string",
      "social_links": {
        "platform": "url"
      }
    }
    ```

*   **404 Not Found:**

    ```json
    {
      "message": "Resource not found",
      "status_code": 404
    }
    ```

### `PUT /api/v1/users/<string:user_id>`

**Description:** Updates a user's profile information.

**Authentication:** JWT Access Token required. User must be the owner of the profile.

**Parameters:**

*   `user_id` (path): The ID of the user to update.

**Request Body:**

```json
{
  "username": "string",
  "display_name": "string",
  "email": "string",
  "bio": "string",
  "avatar_url": "string",
  "banner_url": "string"
}
```

**Responses:**

*   **200 OK:** Returns the updated user object.
*   **403 Unauthorized:** If the current user is not the owner of the profile.
*   **404 Not Found:** If the user does not exist.

### `POST /api/v1/users/<string:user_id>/social-links`

**Description:** Adds or updates a social media link for a user.

**Authentication:** JWT Access Token required. User must be the owner of the profile.

**Parameters:**

*   `user_id` (path): The ID of the user.

**Request Body:**

```json
{
  "platform": "string",
  "url": "string"
}
```

**Responses:**

*   **201 Created:** Returns the updated user object.
*   **400 Bad Request:** If `platform` or `url` is missing.
*   **403 Unauthorized:** If the current user is not the owner of the profile.
*   **404 Not Found:** If the user does not exist.

### `DELETE /api/v1/users/<string:user_id>/social-links/<string:link_id>`

**Description:** Deletes a social media link for a user.

**Authentication:** JWT Access Token required. User must be the owner of the profile.

**Parameters:**

*   `user_id` (path): The ID of the user.
*   `link_id` (path): The ID of the social link to delete.

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "Social link deleted"
    }
    ```

*   **403 Unauthorized:** If the current user is not the owner of the profile.
*   **404 Not Found:** If the user or social link does not exist.

### `POST /api/v1/users/<string:user_id>/follow`

**Description:** Allows the current user to follow another user.

**Authentication:** JWT Access Token required.

**Parameters:**

*   `user_id` (path): The ID of the user to follow.

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "Successfully followed {username}"
    }
    ```

*   **400 Bad Request:** If the user tries to follow themselves.
*   **404 Not Found:** If the user to follow does not exist.
*   **409 Conflict:** If the user is already following the target user.

### `DELETE /api/v1/users/<string:user_id>/follow`

**Description:** Allows the current user to unfollow another user.

**Authentication:** JWT Access Token required.

**Parameters:**

*   `user_id` (path): The ID of the user to unfollow.

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "Successfully unfollowed {username}"
    }
    ```

*   **400 Bad Request:** If the user tries to unfollow themselves.
*   **404 Not Found:** If the user to unfollow or the follow relationship does not exist.

### `GET /api/v1/users/<string:user_id>/followers`

**Description:** Retrieves a list of users who are following the specified user.

**Parameters:**

*   `user_id` (path): The ID of the user.

**Responses:**

*   **200 OK:** Returns a list of user objects.
*   **404 Not Found:** If the user does not exist.

### `GET /api/v1/users/<string:user_id>/following`

**Description:** Retrieves a list of users that the specified user is following.

**Parameters:**

*   `user_id` (path): The ID of the user.

**Responses:**

*   **200 OK:** Returns a list of user objects.
*   **404 Not Found:** If the user does not exist.

---




## NFT API

The NFT API provides endpoints for retrieving NFT listings, details, history, properties, and managing likes.

### `GET /api/v1/nfts`

**Description:** Retrieves a paginated list of NFTs, with optional search, filter, and sort parameters.

**Cache:** Cached for 60 seconds, varies by query string.

**Query Parameters:**

*   `search` (string, optional): Search term for NFT title, description, category, rarity, or tags.
*   `category` (string, optional): Filter by NFT category.
*   `min_price` (float, optional): Filter by minimum price.
*   `max_price` (float, optional): Filter by maximum price.
*   `rarity` (string, optional): Filter by NFT rarity.
*   `creator_id` (string, optional): Filter by NFT creator ID.
*   `sortBy` (string, optional): Sort order. Accepted values: `trending`, `price-low`, `price-high`, `newest` (default), `oldest`, `most-liked`, `sharerCommission-low`, `sharerCommission-high`, `platformFee-low`, `platformFee-high`.
*   `page` (integer, optional): Page number for pagination (default: 1).
*   `perPage` (integer, optional): Number of items per page (default: 10).

**Responses:**

*   **200 OK:**

    ```json
    {
      "nfts": [
        {
          "id": "string",
          "token_id": "string",
          "contract_address": "string",
          "title": "string",
          "description": "string",
          "creator_id": "string",
          "current_owner_id": "string",
          "category": "string",
          "price": "string",
          "price_currency": "string",
          "price_type": "string",
          "rarity": "string",
          "sharer_commission": "string",
          "platform_fee": "string",
          "likes_count": "integer",
          "views_count": "integer",
          "comments_count": "integer",
          "image_ipfs_cid": "string",
          "metadata_ipfs_cid": "string",
          "audio_ipfs_cid": "string",
          "video_ipfs_cid": "string",
          "auction_end_time": "string",
          "current_bid": "string",
          "bidders_count": "integer",
          "status": "string",
          "minted_at": "string",
          "listed_at": "string",
          "created_at": "string",
          "updated_at": "string",
          "creator": "string",
          "creator_avatar": "string",
          "current_owner": "string",
          "tags": [
            "string"
          ],
          "properties": [
            {
              "trait": "string",
              "value": "string",
              "rarity": "string"
            }
          ],
          "price_formatted": "string",
          "image_url": "string",
          "audio_url": "string",
          "video_url": "string"
        }
      ],
      "total": "integer",
      "pages": "integer",
      "current_page": "integer"
    }
    ```

### `GET /api/v1/nfts/<string:nft_id>`

**Description:** Retrieves detailed information about a specific NFT.

**Cache:** Cached for 300 seconds.

**Parameters:**

*   `nft_id` (path): The ID of the NFT to retrieve.

**Responses:**

*   **200 OK:** Returns the NFT object.
*   **404 Not Found:** If the NFT does not exist.

### `GET /api/v1/nfts/<string:nft_id>/history`

**Description:** Retrieves the transaction history for a specific NFT.

**Parameters:**

*   `nft_id` (path): The ID of the NFT.

**Responses:**

*   **200 OK:**

    ```json
    [
      {
        "id": "string",
        "nft_id": "string",
        "transaction_hash": "string",
        "event_type": "string",
        "from_user_id": "string",
        "to_user_id": "string",
        "price": "string",
        "price_currency": "string",
        "gas_fee": "string",
        "block_number": "integer",
        "transaction_date": "string",
        "created_at": "string",
        "updated_at": "string",
        "from": "string",
        "to": "string",
        "price_formatted": "string"
      }
    ]
    ```

*   **404 Not Found:** If the NFT does not exist.

### `GET /api/v1/nfts/<string:nft_id>/properties`

**Description:** Retrieves the properties/traits of a specific NFT.

**Parameters:**

*   `nft_id` (path): The ID of the NFT.

**Responses:**

*   **200 OK:**

    ```json
    [
      {
        "trait": "string",
        "value": "string",
        "rarity": "string"
      }
    ]
    ```

*   **404 Not Found:** If the NFT does not exist.

### `POST /api/v1/nfts/<string:nft_id>/like`

**Description:** Allows a logged-in user to like an NFT.

**Authentication:** JWT Access Token required.

**Parameters:**

*   `nft_id` (path): The ID of the NFT to like.

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "NFT liked successfully",
      "likes_count": "integer"
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.
*   **404 Not Found:** If the NFT does not exist.
*   **409 Conflict:** If the user has already liked the NFT.

### `DELETE /api/v1/nfts/<string:nft_id>/like`

**Description:** Allows a logged-in user to unlike an NFT.

**Authentication:** JWT Access Token required.

**Parameters:**

*   `nft_id` (path): The ID of the NFT to unlike.

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "NFT unliked successfully",
      "likes_count": "integer"
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.
*   **404 Not Found:** If the NFT or the like does not exist.

### `GET /api/v1/nfts/<string:nft_id>/likes`

**Description:** Retrieves a list of users who liked a specific NFT.

**Parameters:**

*   `nft_id` (path): The ID of the NFT.

**Responses:**

*   **200 OK:** Returns a list of user objects who liked the NFT.
*   **404 Not Found:** If the NFT does not exist.

---




## Cart API

The Cart API provides endpoints for managing a user's shopping cart. Currently, it uses a simplified in-memory structure for demonstration purposes.

### `POST /api/v1/cart/items`

**Description:** Adds an NFT to the current user's cart.

**Authentication:** JWT Access Token required.

**Request Body:**

```json
{
  "nft_id": "string"
}
```

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "NFT added to cart successfully",
      "cart_items": [
        {
          "nft_id": "string",
          "title": "string",
          "price": "number",
          "image_url": "string"
        }
      ]
    }
    ```

*   **400 Bad Request:** If `nft_id` is missing.
*   **401 Unauthorized:** If no valid JWT token is provided.
*   **404 Not Found:** If the NFT does not exist.
*   **409 Conflict:** If the NFT is already in the cart.

### `GET /api/v1/cart`

**Description:** Retrieves the current user's cart items.

**Authentication:** JWT Access Token required.

**Responses:**

*   **200 OK:**

    ```json
    {
      "cart_items": [
        {
          "nft_id": "string",
          "title": "string",
          "price": "number",
          "image_url": "string"
        }
      ]
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.

### `DELETE /api/v1/cart/items/<string:nft_id>`

**Description:** Removes an NFT from the current user's cart.

**Authentication:** JWT Access Token required.

**Parameters:**

*   `nft_id` (path): The ID of the NFT to remove from the cart.

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "NFT removed from cart successfully",
      "cart_items": [
        {
          "nft_id": "string",
          "title": "string",
          "price": "number",
          "image_url": "string"
        }
      ]
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.
*   **404 Not Found:** If the cart is not found for the user or the NFT is not in the cart.

---




## Notification API

The Notification API provides endpoints for retrieving, managing, and configuring user notifications.

### `GET /api/v1/notifications`

**Description:** Retrieves all notifications for the current user, ordered by creation date (descending).

**Authentication:** JWT Access Token required.

**Responses:**

*   **200 OK:**

    ```json
    [
      {
        "id": "string",
        "user_id": "string",
        "notification_type": "string",
        "message": "string",
        "read": "boolean",
        "created_at": "string",
        "updated_at": "string"
      }
    ]
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.

### `PUT /api/v1/notifications/<string:notification_id>/read`

**Description:** Marks a specific notification as read.

**Authentication:** JWT Access Token required. User must be the owner of the notification.

**Parameters:**

*   `notification_id` (path): The ID of the notification to mark as read.

**Responses:**

*   **200 OK:** Returns the updated notification object.
*   **401 Unauthorized:** If no valid JWT token is provided.
*   **404 Not Found:** If the notification does not exist or does not belong to the user.

### `DELETE /api/v1/notifications/<string:notification_id>`

**Description:** Deletes a specific notification.

**Authentication:** JWT Access Token required. User must be the owner of the notification.

**Parameters:**

*   `notification_id` (path): The ID of the notification to delete.

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "Notification deleted successfully"
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.
*   **404 Not Found:** If the notification does not exist or does not belong to the user.

### `DELETE /api/v1/notifications`

**Description:** Clears all notifications for the current user.

**Authentication:** JWT Access Token required.

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "All notifications cleared successfully"
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.

### `GET /api/v1/notifications/settings`

**Description:** Retrieves the notification settings for the current user. If no settings exist, default settings are created.

**Authentication:** JWT Access Token required.

**Responses:**

*   **200 OK:**

    ```json
    {
      "id": "string",
      "user_id": "string",
      "sound_enabled": "boolean",
      "push_enabled": "boolean",
      "email_enabled": "boolean",
      "sms_enabled": "boolean",
      "nft_sold_enabled": "boolean",
      "nft_purchased_enabled": "boolean",
      "bid_received_enabled": "boolean",
      "bid_outbid_enabled": "boolean",
      "auction_ending_enabled": "boolean",
      "follow_enabled": "boolean",
      "like_enabled": "boolean",
      "comment_enabled": "boolean",
      "created_at": "string",
      "updated_at": "string"
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.

### `PUT /api/v1/notifications/settings`

**Description:** Updates the notification settings for the current user.

**Authentication:** JWT Access Token required.

**Request Body:**

```json
{
  "sound_enabled": "boolean",
  "push_enabled": "boolean",
  "email_enabled": "boolean",
  "sms_enabled": "boolean",
  "nft_sold_enabled": "boolean",
  "nft_purchased_enabled": "boolean",
  "bid_received_enabled": "boolean",
  "bid_outbid_enabled": "boolean",
  "auction_ending_enabled": "boolean",
  "follow_enabled": "boolean",
  "like_enabled": "boolean",
  "comment_enabled": "boolean"
}
```

**Responses:**

*   **200 OK:** Returns the updated notification settings object.
*   **401 Unauthorized:** If no valid JWT token is provided.
*   **404 Not Found:** If the notification settings do not exist for the user.

---




## Comment API

The Comment API provides endpoints for creating, retrieving, updating, and deleting comments, as well as liking comments.

### `POST /api/v1/comments`

**Description:** Creates a new comment on an NFT or as a reply to an existing comment.

**Authentication:** JWT Access Token required.

**Request Body:**

```json
{
  "content": "string",
  "nft_id": "string",
  "parent_comment_id": "string" (optional)
}
```

**Responses:**

*   **201 Created:**

    ```json
    {
      "id": "string",
      "user_id": "string",
      "nft_id": "string",
      "parent_comment_id": "string",
      "content": "string",
      "likes_count": "integer",
      "created_at": "string",
      "updated_at": "string",
      "author": {
        "id": "string",
        "wallet_address": "string",
        "username": "string",
        "display_name": "string",
        "avatar_url": "string"
      },
      "replies": []
    }
    ```

*   **400 Bad Request:** If `content` or `nft_id` is missing.
*   **401 Unauthorized:** If no valid JWT token is provided.
*   **404 Not Found:** If the NFT does not exist.

### `GET /api/v1/nfts/<string:nft_id>/comments`

**Description:** Retrieves all top-level comments and their replies for a specific NFT.

**Parameters:**

*   `nft_id` (path): The ID of the NFT.

**Responses:**

*   **200 OK:** Returns a list of comment objects, including nested replies.
*   **404 Not Found:** If the NFT does not exist.

### `PUT /api/v1/comments/<string:comment_id>`

**Description:** Updates the content of an existing comment.

**Authentication:** JWT Access Token required. User must be the author of the comment.

**Parameters:**

*   `comment_id` (path): The ID of the comment to update.

**Request Body:**

```json
{
  "content": "string"
}
```

**Responses:**

*   **200 OK:** Returns the updated comment object.
*   **400 Bad Request:** If `content` is missing.
*   **401 Unauthorized:** If no valid JWT token is provided.
*   **403 Unauthorized:** If the current user is not the author of the comment.
*   **404 Not Found:** If the comment does not exist.

### `DELETE /api/v1/comments/<string:comment_id>`

**Description:** Deletes an existing comment.

**Authentication:** JWT Access Token required. User must be the author of the comment.

**Parameters:**

*   `comment_id` (path): The ID of the comment to delete.

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "Comment deleted successfully"
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.
*   **403 Unauthorized:** If the current user is not the author of the comment.
*   **404 Not Found:** If the comment does not exist.

### `POST /api/v1/comments/<string:comment_id>/like`

**Description:** Allows a logged-in user to like a comment.

**Authentication:** JWT Access Token required.

**Parameters:**

*   `comment_id` (path): The ID of the comment to like.

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "Comment liked successfully",
      "likes_count": "integer"
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.
*   **404 Not Found:** If the comment does not exist.
*   **409 Conflict:** If the user has already liked the comment.

### `DELETE /api/v1/comments/<string:comment_id>/like`

**Description:** Allows a logged-in user to unlike a comment.

**Authentication:** JWT Access Token required.

**Parameters:**

*   `comment_id` (path): The ID of the comment to unlike.

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "Comment unliked successfully",
      "likes_count": "integer"
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.
*   **404 Not Found:** If the comment or the like does not exist.

---




## IPFS API

The IPFS API provides endpoints for interacting with IPFS pinning services (e.g., Pinata) to pin, unpin, upload files, and check pin status.

### `POST /api/v1/ipfs/pin`

**Description:** Pins an IPFS hash to the configured pinning service.

**Authentication:** JWT Access Token required.

**Request Body:**

```json
{
  "ipfs_hash": "string"
}
```

**Responses:**

*   **200 OK:**

    ```json
    {
      "id": "string",
      "ipfs_pin_hash": "string",
      "status": "string",
      "created": "string"
    }
    ```

*   **400 Bad Request:** If `ipfs_hash` is missing.
*   **401 Unauthorized:** If no valid JWT token is provided.
*   **500 Internal Server Error:** If Pinata API keys are not configured or pinning fails.

### `POST /api/v1/ipfs/unpin`

**Description:** Unpins an IPFS hash from the configured pinning service.

**Authentication:** JWT Access Token required.

**Request Body:**

```json
{
  "ipfs_hash": "string"
}
```

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "Successfully unpinned IPFS hash"
    }
    ```

*   **400 Bad Request:** If `ipfs_hash` is missing.
*   **401 Unauthorized:** If no valid JWT token is provided.
*   **500 Internal Server Error:** If Pinata API keys are not configured or unpinning fails.

### `POST /api/v1/ipfs/upload`

**Description:** Uploads a file to IPFS via the pinning service.

**Authentication:** JWT Access Token required.

**Request Body:** `multipart/form-data` with a file field named `file`.

**Responses:**

*   **200 OK:**

    ```json
    {
      "IpfsHash": "string",
      "PinSize": "integer",
      "Timestamp": "string"
    }
    ```

*   **400 Bad Request:** If no file is provided or no file part in the request.
*   **401 Unauthorized:** If no valid JWT token is provided.
*   **500 Internal Server Error:** If Pinata API keys are not configured or upload fails.

### `GET /api/v1/ipfs/pin_status/<string:ipfs_hash>`

**Description:** Retrieves the pinning status of a specific IPFS hash.

**Authentication:** JWT Access Token required.

**Parameters:**

*   `ipfs_hash` (path): The IPFS hash to check.

**Responses:**

*   **200 OK:**

    ```json
    {
      "rows": [
        {
          "id": "string",
          "ipfs_pin_hash": "string",
          "status": "string",
          "created": "string",
          "name": "string",
          "meta": {},
          "regions": []
        }
      ]
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.
*   **500 Internal Server Error:** If Pinata API keys are not configured or status retrieval fails.

---




## Analytics API

The Analytics API provides endpoints for retrieving various analytical data related to NFTs, users, and sales.

### `GET /api/v1/analytics/sales-trends`

**Description:** Retrieves mock sales trend data. In a real application, this would come from transaction data.

**Responses:**

*   **200 OK:**

    ```json
    [
      {
        "date": "string (YYYY-MM-DD)",
        "sales": "integer",
        "volume": "number"
      }
    ]
    ```

### `GET /api/v1/analytics/category-distribution`

**Description:** Retrieves the distribution of NFTs by category.

**Responses:**

*   **200 OK:**

    ```json
    [
      {
        "category": "string",
        "count": "integer"
      }
    ]
    ```

### `GET /api/v1/analytics/user-activity`

**Description:** Retrieves user activity statistics, including total users, NFTs, comments, likes, and recent activity.

**Responses:**

*   **200 OK:**

    ```json
    {
      "total_users": "integer",
      "total_nfts": "integer",
      "total_comments": "integer",
      "total_likes": "integer",
      "recent_users": "integer",
      "recent_comments": "integer"
    }
    ```

### `GET /api/v1/analytics/top-nfts`

**Description:** Retrieves a list of top NFTs based on likes, views, or price.

**Query Parameters:**

*   `limit` (integer, optional): The maximum number of NFTs to return (default: 10).
*   `sort_by` (string, optional): Sort order. Accepted values: `likes` (default), `views`, `price`.

**Responses:**

*   **200 OK:** Returns a list of NFT objects.

### `GET /api/v1/analytics/revenue`

**Description:** Retrieves mock revenue analytics data. In a real application, this would come from transaction data.

**Responses:**

*   **200 OK:**

    ```json
    {
      "total_revenue": "number",
      "platform_fees": "number",
      "creator_royalties": "number",
      "sharer_commissions": "number",
      "monthly_revenue": [
        {
          "month": "string (YYYY-MM)",
          "revenue": "number"
        }
      ]
    }
    ```

### `GET /api/v1/analytics/popular-creators`

**Description:** Retrieves a list of popular creators based on the number of NFTs created and total likes received.

**Query Parameters:**

*   `limit` (integer, optional): The maximum number of creators to return (default: 10).

**Responses:**

*   **200 OK:**

    ```json
    [
      {
        "id": "string",
        "wallet_address": "string",
        "display_name": "string",
        "username": "string",
        "avatar_url": "string",
        "nft_count": "integer",
        "total_likes": "integer"
      }
    ]
    ```

---




## Referral API

The Referral API provides endpoints for generating referral links, tracking clicks and conversions, and managing user rewards.

### `POST /api/v1/referral/generate-link`

**Description:** Generates a unique referral link for the current user.

**Authentication:** JWT Access Token required.

**Responses:**

*   **200 OK:**

    ```json
    {
      "link": "string",
      "referral_code": "string"
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.

### `POST /api/v1/referral/track-click`

**Description:** Tracks a click on a referral link.

**Request Body:**

```json
{
  "referral_code": "string"
}
```

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "Click tracked"
    }
    ```

### `POST /api/v1/referral/track-conversion`

**Description:** Tracks a conversion from a referral link and potentially assigns rewards.

**Request Body:**

```json
{
  "referral_code": "string",
  "converted_user_id": "string"
}
```

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "Conversion tracked"
    }
    ```

### `GET /api/v1/referral/rewards`

**Description:** Retrieves the current user's referral rewards.

**Authentication:** JWT Access Token required.

**Responses:**

*   **200 OK:**

    ```json
    {
      "user_id": "string",
      "rewards": [
        {
          "type": "string",
          "amount": "number",
          "currency": "string",
          "status": "string"
        }
      ]
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.

### `POST /api/v1/referral/claim-reward`

**Description:** Allows the current user to claim a referral reward.

**Authentication:** JWT Access Token required.

**Request Body:**

```json
{
  "reward_id": "string"
}
```

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "Reward {reward_id} claimed successfully"
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.

---




## Anti-Brushing API

The Anti-Brushing API provides endpoints for checking reward eligibility, recording reward claims, and logging user behavioral data for fraud detection.

### `POST /api/v1/anti-brushing/check-reward-eligibility`

**Description:** Checks if the current user is eligible to claim a specific reward type. This is a mock implementation and in a real system would involve complex checks.

**Authentication:** JWT Access Token required.

**Request Body:**

```json
{
  "reward_type": "string" // e.g., "daily_login_bonus", "referral_bonus"
}
```

**Responses:**

*   **200 OK:**

    ```json
    {
      "is_eligible": "boolean",
      "reason": "string" // Optional: reason for ineligibility
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.

### `POST /api/v1/anti-brushing/record-reward-claim`

**Description:** Records a reward claim for the current user. This is a mock implementation.

**Authentication:** JWT Access Token required.

**Request Body:**

```json
{
  "reward_type": "string",
  "reward_amount": "number",
  "transaction_id": "string" (optional)
}
```

**Responses:**

*   **200 OK:**

    ```json
    {
      "message": "Reward claim recorded"
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.

### `POST /api/v1/anti-brushing/behavioral-analysis`

**Description:** Logs user behavioral data for fraud detection. This is a mock implementation.

**Authentication:** JWT Access Token required.

**Request Body:**

```json
{
  "action": "string",
  "timestamp": "string",
  "device_fingerprint": "string" (optional)
}
```

**Responses:**

*   **200 OK:**

    ```json
    {
      "is_suspicious": "boolean",
      "message": "Behavior recorded"
    }
    ```

*   **401 Unauthorized:** If no valid JWT token is provided.

---





---

## Staking/Governance API

The Staking/Governance API handles staking pools, user stakes, governance proposals, and voting functionality.

### `GET /api/v1/staking/pools`

**Description:** Retrieves all available staking pools.

**Authentication:** Not required.

**Query Parameters:**
- `status` (optional): Filter by pool status ('active', 'inactive')
- `min_apy` (optional): Filter by minimum APY

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "token_address": "string",
      "apy": 12.5,
      "total_staked": 1000000.0,
      "max_stake": 5000000.0,
      "min_stake": 100.0,
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 5
}
```

### `POST /api/v1/staking/stake`

**Description:** Creates a new staking record for a user.

**Authentication:** Required (Bearer token).

**Request Body:**
```json
{
  "pool_id": "string",
  "amount": 1000.0,
  "duration_days": 30
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "user_id": "string",
    "pool_id": "string",
    "amount": 1000.0,
    "duration_days": 30,
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### `GET /api/v1/staking/governance/proposals`

**Description:** Retrieves all governance proposals.

**Authentication:** Not required.

**Query Parameters:**
- `status` (optional): Filter by proposal status ('active', 'passed', 'rejected')
- `category` (optional): Filter by proposal category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "category": "protocol_upgrade",
      "status": "active",
      "votes_for": 1500,
      "votes_against": 300,
      "total_votes": 1800,
      "end_time": "2024-02-01T00:00:00Z"
    }
  ]
}
```

### `POST /api/v1/staking/governance/vote`

**Description:** Submit a vote on a governance proposal.

**Authentication:** Required (Bearer token).

**Request Body:**
```json
{
  "proposal_id": "string",
  "vote": "for",
  "voting_power": 100.0
}
```

---

## Wallet API

The Wallet API handles wallet balances, transaction records, and wallet connections.

### `GET /api/v1/wallet/balance/{user_id}`

**Description:** Retrieves wallet balance for a specific user.

**Authentication:** Required (Bearer token).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "user_id": "string",
      "token_address": "string",
      "token_symbol": "SOL",
      "balance": 10.5,
      "locked_balance": 2.0,
      "last_updated": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### `GET /api/v1/wallet/transactions/{user_id}`

**Description:** Retrieves transaction history for a user.

**Authentication:** Required (Bearer token).

**Query Parameters:**
- `type` (optional): Filter by transaction type
- `limit` (optional): Number of transactions to return (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "user_id": "string",
      "transaction_hash": "string",
      "transaction_type": "transfer",
      "amount": 5.0,
      "currency": "SOL",
      "status": "confirmed",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### `POST /api/v1/wallet/connections`

**Description:** Add a new wallet connection for a user.

**Authentication:** Required (Bearer token).

**Request Body:**
```json
{
  "wallet_address": "string",
  "wallet_type": "phantom",
  "is_primary": true
}
```

---

## Barter API

The Barter API handles NFT-to-NFT trading without currency exchange.

### `GET /api/v1/barter/requests`

**Description:** Retrieves barter requests.

**Authentication:** Not required.

**Query Parameters:**
- `status` (optional): Filter by request status
- `nft_category` (optional): Filter by NFT category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "requester_id": "string",
      "offered_nft_id": "string",
      "desired_nft_criteria": {
        "category": "art",
        "min_value": 1.0
      },
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### `POST /api/v1/barter/requests`

**Description:** Create a new barter request.

**Authentication:** Required (Bearer token).

**Request Body:**
```json
{
  "offered_nft_id": "string",
  "desired_nft_criteria": {
    "category": "art",
    "min_value": 1.0,
    "max_value": 10.0
  },
  "description": "string",
  "expires_at": "2024-02-01T00:00:00Z"
}
```

### `POST /api/v1/barter/requests/{request_id}/respond`

**Description:** Respond to a barter request.

**Authentication:** Required (Bearer token).

**Request Body:**
```json
{
  "offered_nft_id": "string",
  "message": "string"
}
```

---

## Bulk Operations API

The Bulk Operations API handles batch operations for NFTs and other resources.

### `GET /api/v1/bulk-operations/operations`

**Description:** Retrieves user's bulk operations.

**Authentication:** Required (Bearer token).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "user_id": "string",
      "operation_type": "bulk_list",
      "status": "completed",
      "total_items": 50,
      "processed_items": 50,
      "failed_items": 0,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### `POST /api/v1/bulk-operations/operations`

**Description:** Create a new bulk operation.

**Authentication:** Required (Bearer token).

**Request Body:**
```json
{
  "operation_type": "bulk_list",
  "items": [
    {
      "nft_id": "string",
      "price": 1.5,
      "currency": "SOL"
    }
  ],
  "schedule_time": "2024-01-01T12:00:00Z"
}
```

### `POST /api/v1/bulk-operations/operations/{operation_id}/execute`

**Description:** Execute a bulk operation.

**Authentication:** Required (Bearer token).

---

## Activity Calendar API

The Activity Calendar API manages platform events and user participation.

### `GET /api/v1/activity-calendar/activities`

**Description:** Retrieves platform activities.

**Authentication:** Not required.

**Query Parameters:**
- `start_date` (optional): Filter activities from this date
- `end_date` (optional): Filter activities until this date
- `category` (optional): Filter by activity category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "category": "auction",
      "start_time": "2024-01-01T10:00:00Z",
      "end_time": "2024-01-01T18:00:00Z",
      "max_participants": 100,
      "current_participants": 45,
      "status": "active"
    }
  ]
}
```

### `POST /api/v1/activity-calendar/activities`

**Description:** Create a new activity.

**Authentication:** Required (Bearer token).

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "category": "auction",
  "start_time": "2024-01-01T10:00:00Z",
  "end_time": "2024-01-01T18:00:00Z",
  "max_participants": 100
}
```

### `POST /api/v1/activity-calendar/activities/{activity_id}/participate`

**Description:** Participate in an activity.

**Authentication:** Required (Bearer token).

---

## Intent Pool API

The Intent Pool API manages user trading intentions and matching.

### `GET /api/v1/intent-pool/intents`

**Description:** Retrieves trading intents.

**Authentication:** Not required.

**Query Parameters:**
- `intent_type` (optional): Filter by intent type ('buy', 'sell')
- `category` (optional): Filter by NFT category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "user_id": "string",
      "intent_type": "buy",
      "nft_criteria": {
        "category": "art",
        "max_price": 5.0
      },
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### `POST /api/v1/intent-pool/intents`

**Description:** Create a new trading intent.

**Authentication:** Required (Bearer token).

**Request Body:**
```json
{
  "intent_type": "buy",
  "nft_criteria": {
    "category": "art",
    "max_price": 5.0,
    "min_rarity": "rare"
  },
  "expires_at": "2024-02-01T00:00:00Z"
}
```

### `POST /api/v1/intent-pool/intents/{intent_id}/respond`

**Description:** Respond to a trading intent.

**Authentication:** Required (Bearer token).

**Request Body:**
```json
{
  "nft_id": "string",
  "proposed_price": 4.5,
  "message": "string"
}
```

---

## NFT Minting API

The NFT Minting API provides auxiliary services for frontend-driven NFT minting.

### `GET /api/v1/minting/contracts`

**Description:** Retrieves smart contract information for minting.

**Authentication:** Not required.

**Query Parameters:**
- `network` (optional): Filter by network ('mainnet', 'testnet', 'devnet')
- `type` (optional): Filter by contract type ('nft', 'marketplace')

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "CFISH NFT Contract",
      "address": "0x1234567890abcdef1234567890abcdef12345678",
      "abi": {
        "mint": {
          "inputs": [
            {"name": "to", "type": "address"},
            {"name": "tokenURI", "type": "string"}
          ]
        }
      },
      "network": "mainnet",
      "contract_type": "nft",
      "version": "1.0.0"
    }
  ]
}
```

### `POST /api/v1/minting/fees/estimate`

**Description:** Estimates minting fees for a contract.

**Authentication:** Not required.

**Request Body:**
```json
{
  "contract_address": "string",
  "network": "mainnet"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "contract_address": "string",
    "network": "mainnet",
    "base_fee": 0.01,
    "gas_price": 0.000001,
    "estimated_gas": 50000,
    "total_fee": 0.06,
    "currency": "SOL"
  }
}
```

### `POST /api/v1/minting/events`

**Description:** Records a minting event for tracking.

**Authentication:** Required (Bearer token).

**Request Body:**
```json
{
  "transaction_hash": "string",
  "contract_address": "string",
  "metadata_uri": "string",
  "token_id": "string"
}
```

### `GET /api/v1/minting/network/status`

**Description:** Retrieves network status information.

**Authentication:** Not required.

**Query Parameters:**
- `network` (optional): Specify network (default: 'mainnet')

**Response:**
```json
{
  "success": true,
  "data": {
    "network": "mainnet",
    "is_healthy": true,
    "block_height": 123456789,
    "average_block_time": 0.4,
    "congestion_level": "low",
    "recommended_gas_price": 0.000001
  }
}
```

---

## Auction Management API

The Auction Management API handles NFT auctions, bidding, and auction lifecycle.

### `GET /api/v1/auction/auctions`

**Description:** Retrieves auction listings.

**Authentication:** Not required.

**Query Parameters:**
- `status` (optional): Filter by auction status ('active', 'ended', 'cancelled')
- `type` (optional): Filter by auction type ('english', 'dutch', 'sealed_bid')
- `seller_id` (optional): Filter by seller ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "nft_id": "string",
      "seller_id": "string",
      "title": "Rare Digital Art Piece",
      "starting_price": 1.0,
      "current_price": 2.5,
      "currency": "SOL",
      "auction_type": "english",
      "status": "active",
      "end_time": "2024-01-08T00:00:00Z",
      "total_bids": 15
    }
  ]
}
```

### `POST /api/v1/auction/auctions`

**Description:** Creates a new auction.

**Authentication:** Required (Bearer token).

**Request Body:**
```json
{
  "nft_id": "string",
  "title": "string",
  "description": "string",
  "starting_price": 1.0,
  "reserve_price": 5.0,
  "currency": "SOL",
  "auction_type": "english",
  "end_time": "2024-01-08T00:00:00Z",
  "bid_increment": 0.1
}
```

### `POST /api/v1/auction/auctions/{auction_id}/bid`

**Description:** Places a bid on an auction.

**Authentication:** Required (Bearer token).

**Request Body:**
```json
{
  "amount": 2.5,
  "bid_type": "regular"
}
```

### `POST /api/v1/auction/auctions/{auction_id}/end`

**Description:** Ends an auction (seller only).

**Authentication:** Required (Bearer token).

### `GET /api/v1/auction/auctions/watchlist`

**Description:** Retrieves user's auction watchlist.

**Authentication:** Required (Bearer token).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "auction_id": "string",
      "notification_enabled": true,
      "price_alert_threshold": 3.0,
      "auction": {
        "id": "string",
        "title": "string",
        "current_price": 2.5,
        "status": "active"
      }
    }
  ]
}
```

---

## Dispute Resolution API

The Dispute Resolution API handles user disputes, evidence submission, and resolution processes.

### `POST /api/v1/dispute/disputes`

**Description:** Submits a new dispute.

**Authentication:** Required (Bearer token).

**Request Body:**
```json
{
  "respondent_id": "string",
  "dispute_type": "transaction",
  "category": "buyer_complaint",
  "title": "string",
  "description": "string",
  "related_transaction_id": "string",
  "amount_disputed": 5.0,
  "currency": "SOL"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "case_number": "CFISH-20240101-1234",
    "complainant_id": "string",
    "respondent_id": "string",
    "dispute_type": "transaction",
    "status": "submitted",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### `GET /api/v1/dispute/disputes`

**Description:** Retrieves user's disputes.

**Authentication:** Required (Bearer token).

**Query Parameters:**
- `status` (optional): Filter by dispute status
- `role` (optional): Filter by user role ('complainant', 'respondent', 'all')

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "case_number": "CFISH-20240101-1234",
      "title": "string",
      "dispute_type": "transaction",
      "status": "under_review",
      "priority": "medium",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### `POST /api/v1/dispute/disputes/{dispute_id}/evidence`

**Description:** Submits evidence for a dispute.

**Authentication:** Required (Bearer token).

**Request Body:**
```json
{
  "evidence_type": "document",
  "title": "string",
  "description": "string",
  "file_url": "string",
  "file_hash": "string"
}
```

### `POST /api/v1/dispute/disputes/{dispute_id}/messages`

**Description:** Sends a message in a dispute.

**Authentication:** Required (Bearer token).

**Request Body:**
```json
{
  "content": "string",
  "message_type": "text",
  "attachments": ["string"],
  "is_private": false
}
```

### `GET /api/v1/dispute/mediators`

**Description:** Retrieves available mediators.

**Authentication:** Not required.

**Query Parameters:**
- `specialization` (optional): Filter by specialization
- `language` (optional): Filter by language support

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "user_id": "string",
      "specializations": ["transaction_disputes", "nft_authenticity"],
      "languages": ["en", "zh"],
      "experience_years": 5,
      "rating": 4.8,
      "total_cases": 150,
      "successful_resolutions": 135
    }
  ]
}
```

### `POST /api/v1/dispute/disputes/{dispute_id}/resolve`

**Description:** Resolves a dispute (mediator/arbitrator only).

**Authentication:** Required (Bearer token).

**Request Body:**
```json
{
  "resolution_type": "mediation_agreement",
  "resolution_summary": "string",
  "resolution_details": {},
  "financial_settlement": {
    "amount": 2.5,
    "currency": "SOL",
    "recipient": "string"
  },
  "is_binding": true
}
```

---

## Error Responses

All API endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Rate limit exceeded"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Authentication

Most endpoints require authentication using Bearer tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

Tokens are obtained through the `/api/v1/auth/login` endpoint and should be refreshed using the `/api/v1/auth/refresh` endpoint when they expire.

---

## Rate Limiting

API endpoints are subject to rate limiting to ensure fair usage:

- Default: 200 requests per day, 50 requests per hour
- Authentication endpoints: 5 requests per minute
- Specific endpoints may have custom limits as documented

Rate limit information is included in response headers:
- `X-RateLimit-Limit`: Request limit per time window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

---

This completes the comprehensive API documentation for the CFISH backend system. All endpoints include proper error handling, authentication where required, and follow RESTful conventions.

