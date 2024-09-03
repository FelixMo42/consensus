<svelte:head>
	<title>Admin</title>
	<meta name="description" content="Admin" />
</svelte:head>

<script lang="ts">
    import { getUsers, removeUsers, setUserRole } from "$lib/api"
    import type { User } from "$lib/types"
    import { onMount } from "svelte"

	let users: User[] = []
	
	onMount(async () => {
		users = await getUsers()
	})
</script>

<section>
	<h1>Admin</h1>

	{#each users as user}
		<div class="row">
			<h2 class="flex">
				{user.firstName}
				{user.lastName}
				(<a href="https://orcid.org/{user.id}">{user.id}</a>)
			</h2>
		
			{#if user.role === "pending"}
				<button
					class="button"
					on:click={() => setUserRole(user.id, "denied")}
				>Deny</button>
				<button
					class="button"
					on:click={() => setUserRole(user.id, "expert")}
				>Approve</button>
			{/if}

			{#if user.role !== "admin"}
				<button
					class="button"
					on:click={() => setUserRole(user.id, "admin")}
				>Make Admin</button>
			{/if}

			<button
				class="button dangerous"
				on:click={() => removeUsers(user.id)}
			>Delete</button>
		</div>
	{/each}
</section>

<style>
	button:first-child {
		margin-left: 0px;
	}

	.row {
		align-items: center;
	}
</style>