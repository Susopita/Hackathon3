import { useRouter } from 'next/router';

interface ButtonProps {
    to: string;
    message: string;
}

export default function Button(props: ButtonProps) {
    const router = useRouter();
    const buttonStyle = router.pathname === props.to ? "active" : "";

    function handleClick() {
        router.push(props.to);
    }

    return (
        <button className={buttonStyle} onClick={handleClick}>
            {props.message}
        </button>
    );
}
