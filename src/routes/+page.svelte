<svelte:head>
	<title>Sci-Con</title>
	<meta name="description" content="sci-con" />
</svelte:head>

<script lang="ts">
	import { page } from "$app/stores"
    import QuestionsView from "../parts/QuestionsView.svelte"
	import { dev } from '$app/environment'

	const isAuth = dev ? true : $page.data.session
</script>

<section class="main">
	<h1>Scientific Consensus</h1>

	{#if !isAuth}
		<form method="POST" action="/signin" class="authForm">
			<input type="hidden" name="providerId" value="orcid" />
			<button class="authButton">
				<img
					src="https://orcid.org/sites/default/files/images/orcid_24x24.png"
					alt="ORCID logo"
				/>
				Sign in with ORCID
			</button>
		</form>
	{:else}
		<QuestionsView></QuestionsView>	

		<form method="POST" action="/signout" class="authForm">
			<input type="hidden" name="providerId" value="orcid" />
			<button class="authButton">
				Sign out
			</button>
		</form>
	{/if}
</section>

<style>
	.authButton {
		display: flex;
		border: 1px solid gray;
		margin: auto;
		background: none;
		border-radius: 5px;
		padding: 10px 40px;
		align-items: center;
		margin-top: 20px;
		cursor: pointer;
	}

	.authButton img {
		margin-right: 10px;
	}	

	.authButton:hover {
		text-decoration: none;
	}
</style>
