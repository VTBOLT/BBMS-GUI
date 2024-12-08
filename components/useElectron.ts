import { useEffect, useState } from "react";
import { getElectron, ElectronWindow } from "./electron";

export const useElectron = () => {
	const [electron, setElectron] = useState<
		ElectronWindow["electron"] | undefined
	>(undefined);

	useEffect(() => {
		// Only access electron after component mounts
		setElectron(getElectron());
	}, []);

	return electron;
};
