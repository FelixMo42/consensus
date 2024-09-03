<script lang="ts">
	import { page } from "$app/stores"
	import { dev } from '$app/environment'
    import type { Question } from "$lib/types"
    import { createEventDispatcher } from "svelte"

	const isAuth = dev ? true : $page.data.session

    export let question: Question

	const dispatch = createEventDispatcher<{
		vote: { vote: string }
	}>()

	const votes = ["yes", "no", "open", "vague"] as const

	function vote(vote: string) {
		return () => dispatch('vote', { vote })
	}

	function hasVotes(vote: string) {
		return vote in question.votes && question.votes[vote] > 0
	}

	function numVotes(vote: string) {
		return question.votes[vote]
	}

	const voteButtons = [
		{
			text: "Yes",
			vote: "yes",
			classes: "circle button"
		},
		{
			text: "No",
			vote: "no",
			classes: "circle button"
		},
		{
			text: "Still open",
			vote: "open",
			classes: "button"
		},
		{
			text: "Too vague",
			vote: "vague",
			classes: "button"
		},
		{
			text: "skip",
			vote: "skip",
			classes: "bare button"
		},
	]
</script>

<div class="container">
    <h2>
        {question.question}
    </h2>
	<div class="row">
		{#each votes as vote}
			{#if hasVotes(vote)}
				<div
					class="bar {vote}"
					style="flex:{numVotes(vote)}"
				>{vote} ({numVotes(vote)})</div>
			{/if}
		{/each}
	</div>
	{#if isAuth}
		<div class="row">
			<span class="button-label">My vote:</span>
			{#each voteButtons as button}
				<button
					class="
						{button.classes}
						{question.myVote === button.vote ? "my-vote" : ""}
					"
					on:click={vote(button.vote)}
				>{button.text}</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        padding: 25px 0px;
    }

	.row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	/* Buttons */

	.button-label {
		font-weight: bold;
	}

	.button.my-vote {
		text-decoration: underline;
	}

	.button.circle {
		width: 50px;
		height: 50px;
		padding: 0px;
	}

	/* Vote bar */
	
	.bar {
		display: flex;
		padding: 5px;
		margin: 2px;
		justify-content: center;
	}

	.bar:first-child {
		border-top-left-radius: 20px;
		border-bottom-left-radius: 20px;
	}

	.bar:last-child {
		border-top-right-radius: 20px;
		border-bottom-right-radius: 20px;
	}

	.bar.yes {
		background-color: darkgreen;
	}

	.bar.no {
		background-color: darkred;
	}

	.bar.vague {
		background-color: gray;
	}

	.bar.open {
		background-color: darkcyan;
	}	
</style>
