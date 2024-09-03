<script lang="ts">
	import { page } from "$app/stores";
    import QuestionsView from "../parts/QuestionsView.svelte";
	import { dev } from '$app/environment';

	const isAuth = dev ? true : $page.data.session
</script>

<svelte:head>
	<title>Sci-Con</title>
	<meta name="description" content="sci-con" />
</svelte:head>

<section>
	<h1>Scientific Consensus</h1>

	{#if !isAuth}
		<form method="POST" action="/signin" class="signInForm">
			<input type="hidden" name="providerId" value="orcid" />
			<button class="signInButton">
				<img
					src="https://orcid.org/sites/default/files/images/orcid_24x24.png"
					alt="ORCID logo"
				/>
				Sign in with ORCID
			</button>
		</form>
	{:else}
		<QuestionsView></QuestionsView>	

		<form method="POST" action="/signout" class="signInForm">
			<input type="hidden" name="providerId" value="orcid" />
			<button class="signInButton">
				Sign out
			</button>
		</form>
	{/if}
</section>

<style>
	h1 {
		text-decoration: underline;
		margin-bottom: 0px;
	}

	.signInButton {
		display: flex;
		border: 1px solid gray;
		margin: auto;
		border-radius: 5px;
		padding: 10px 40px;
		align-items: center;
		font-size: large;
		margin-top: 20px;
		cursor: pointer;
	}

	.signInButton img {
		margin-right: 10px;
	}	
</style>
