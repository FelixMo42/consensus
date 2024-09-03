<script lang="ts">
    import type { Question } from "$lib/types";
    import { createEventDispatcher } from "svelte";

    export let question: Question;

	const dispatch = createEventDispatcher<{
		"vote": {
			vote: string
		}
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

	let myVote = ""

	const voteButtons = [
		{
			text: "Yes",
			vote: "yes",
			classes: "b circle"
		},
		{
			text: "No",
			vote: "no",
			classes: "b circle"
		},
		{
			text: "Still open",
			vote: "open",
			classes: "b"
		},
		{
			text: "Too vague",
			vote: "vague",
			classes: "b"
		},
		{
			text: "skip",
			vote: "skip",
			classes: "skip"
		},
	]
</script>

<div class="container">
    <h2>
        {question.question}
    </h2>
	<div class="vote row">
		{#each votes as vote}
			{#if hasVotes(vote)}
				<div
					class="bar {vote}"
					style="flex:{numVotes(vote)}"
				>{vote} ({numVotes(vote)})</div>
			{/if}
		{/each}
	</div>
	<div class="row">
		<span>My vote:</span>
		{#each voteButtons as button}
			<button
				class="{button.classes} {myVote === button.vote ? "my-vote" : ""}"
				on:click={vote(button.vote)}
			>{button.text}</button>
		{/each}
	</div>
</div>

<style>
	.bar {
		display: flex;
		padding: 5px;
		margin: 2px;
		justify-content: center;
	}

	.row span {
		font-size: 1.25em;
		font-weight: bold;
	}

	.skip {
		background: none;
		opacity: 90%;
	}

	.my-vote {
		text-decoration: underline;
	}

	.bar:first-child {
		border-top-left-radius: 20px;
		border-bottom-left-radius: 20px;
	}

	.bar:last-child {
		border-top-right-radius: 20px;
		border-bottom-right-radius: 20px;
	}

	.yes {
		background-color: darkgreen;
	}

	.no {
		background-color: darkred;
	}

	.vague {
		background-color: gray;
	}

	.open {
		background-color: darkcyan;
	}

    .container {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        padding: 25px 0px;
    }

	h2 {
		font-size: 1.5em;
	}

	.row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	

	button {
		color: white;
		border: none;
        cursor: pointer;
	}

	.b {
		background-color: rgba(255, 255, 255, 0.1);
		color: white;
		margin: 10px;
		border-radius: 100px;
		padding: 0px 20px;
		height: 50px;
	}

	.b.circle {
		width: 50px;
		height: 50px;
		padding: 0px;
	}

    button:hover {
        text-decoration: underline;
    }
</style>
