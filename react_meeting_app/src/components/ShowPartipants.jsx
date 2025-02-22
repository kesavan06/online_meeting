import "../Participants.css";

export default function ShowParticipant({ name, index }) {
    return (
        <div className="name">
            <p>{index}.{name}</p>
        </div>
    )
}