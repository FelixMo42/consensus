<script lang="ts">
	import { SignIn, SignOut } from "@auth/sveltekit/components";
	import { page } from "$app/stores";
	import { addQuestion, getQuestions, getUserInfo, submitVote } from "$lib/lib";
	import { onMount } from "svelte";
	import QuestionEl from "../QuestionEl.svelte";
	import type { Question } from "$lib/types";

	let userId = "";
	let questions: Question[] = [];

	onMount(async () => {
		userId = localStorage.getItem("user") || "";
		questions = await getQuestions();
	});

	page.subscribe(console.log)
</script>

<svelte:head>
	<title>Sci-Con</title>
	<meta name="description" content="sci-con" />
</svelte:head>

{#if $page.data.session}
	<span class="signedInText">Signed in!</span>
	<button on:click={async () => {
		const info = await getUserInfo()
		console.log(info)
	}}>get my info</button>
	{JSON.stringify(page)}
	<SignOut>
		<div slot="submitButton" class="buttonPrimary">Sign out</div>
	</SignOut>
{:else}
	<span class="notSignedInText">You are not signed in</span>
	<SignIn provider="orcid" />
{/if}

<section>
	<h1>Scientific Consensus</h1>
	{#each questions as question}
		<QuestionEl
			{question}
			on:vote={async (e) => {
				questions = await submitVote({
					userId,
					qId: question.id,
					vote: e.detail.vote,
				});
			}}
		/>
	{/each}
	<button class="add" on:click={addQuestion}>+ add question</button>
</section>

<style>
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
