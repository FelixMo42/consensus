<script lang="ts">
	import { SignIn, SignOut } from "@auth/sveltekit/components";
	import { page } from "$app/stores";
	import {
		addQuestion,
		getQuestions,
		submitVote,
	} from "$lib/api";
	import { onMount } from "svelte";
	import QuestionEl from "../QuestionEl.svelte";
	import type { Question } from "$lib/types";

	let questions: Question[] = [];

	onMount(async () => {
		questions = await getQuestions();
	});
</script>

<svelte:head>
	<title>Sci-Con</title>
	<meta name="description" content="sci-con" />
</svelte:head>

<section>
	<h1>Scientific Consensus</h1>

	{#if !$page.data.session}
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
		{#each questions as question}
			<QuestionEl
				{question}
				on:vote={async (e) => {
					questions = await submitVote({
						qId: question.id,
						vote: e.detail.vote,
					});
				}}
			/>
		{/each}
		<button class="add" on:click={addQuestion}>+ add question</button>
	{/if}
</section>

<style>
	.signInButton {
		display: flex;
		border: 1px solid gray;
		margin: auto;
		border-radius: 5px;
		padding: 10px 40px;
		align-items: center;
		font-size: large;
		margin-top: 20px;
	}

	.signInButton img {
		margin-right: 10px;
	}

	h1 {
		text-decoration: underline;
		margin-bottom: 0px;
	}

	.add {
		border: none;
		background: none;
		color: white;
		font-size: 1.25em;
		padding: 10px;
		display: block;
		width: 100%;
		text-align: center;
		cursor: pointer;
	}

	.add:hover {
		text-decoration: underline;
	}
</style>
