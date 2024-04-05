import {InfinitySpin, LineWave} from 'react-loader-spinner';

export const LoadingIndicator = () => {
    const style = {
        marginTop: '-25px',
    }

    return (
        <div style={style}>
            <LineWave
                width='100'
                color="#24475B"
            />
        </div>
    )
}