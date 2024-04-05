import { SignUp } from "@clerk/nextjs";
import styles from "@/app/styles/AuthStyles.module.scss";
import Image from "next/image";
import peopleHavingFun from "/public/images/peopleHavingFun.jpg";

export default function Page() {
	return (
		<div className={styles.pageContainer}>
			<div className={styles.mainImageContainer}>
				<Image src={peopleHavingFun}
				       alt={"Bride and Groom exiting the wedding with family and friends spectating all around."}
				       className={styles.peopleHavingFun}>
				</Image>
			</div>
			<div className={styles.formSection}>
				<SignUp />
			</div>
		</div>
	);
}