import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Theme } from "@mui/material";

export const useStyles = makeStyles((theme:Theme) => createStyles({
    root: {
        width: 282,
        height: 374,
        position: 'relative',
    },
    container1: {
        width: 282,
        height: 281,
        left: 0,
        top: 93,
        position: 'absolute',
        background: 'linear-gradient(180deg, rgba(242, 242, 242, 0) 0%, #F2F2F2 100%)',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    container2: {
        width: 220,
        height: 220,
        left: 31,
        top: 0,
        position: 'absolute',
    },
    overlay: {
        width: 138,
        height: 11,
        left: 45,
        top: 200,
        position: 'absolute',
        background: '#A7A6A6',
        boxShadow: '13px 13px 13px ',
        borderRadius: '9999px',
        filter: 'blur(13px)',
    },
    imageContainer: {
        width: 220,
        height: 220,
        left: 0,
        top: 0,
        position: 'absolute',
    },
    image: {
        width: 216,
        height: 216,
        left: 2,
        top: 2,
        position: 'absolute',
    },
    discountContainer: {
        width: 50,
        height: 20,
        padding: 4,
        left: 0,
        top: 0,
        position: 'absolute',
        background: '#3F9C45',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        display: 'inline-flex',
    },
    discountText: {
        color: 'white',
        fontSize: 10,
        fontFamily: 'Proxima Nova',
        fontWeight: 800,
        wordWrap: 'break-word',
    },
    title: {
        width: 250,
        left: 16,
        top: 235,
        position: 'absolute',
        textAlign: 'center',
        color: '#0D3823',
        fontSize: 16,
        fontFamily: 'Proxima Nova',
        fontWeight: 400,
        wordWrap: 'break-word',
    },
    price: {
        width: 139,
        left: 70.5,
        top: 260,
        position: 'absolute',
        color: '#585858',
        fontSize: 12,
        fontFamily: 'Proxima Nova',
        fontWeight: 400,
        letterSpacing: 1.2,
        wordWrap: 'break-word',
    },
    priceContainer: {
        left: 106.5,
        top: 292,
        position: 'relative',
        display: 'block'
    },
    priceValue: {
        color: '#0D3823',
        fontSize: 16,
        fontFamily: 'Proxima Nova',
        fontWeight: 700,
        wordWrap: 'break-word',
    },
    originalPrice: {
        color: '#909592',
        fontSize: 16,
        fontFamily: 'Proxima Nova',
        fontWeight: 400,
        wordWrap: 'break-word',
    },
    actionButtonsContainer: {
        left: 16,
        top: 326,
        position: 'absolute',
    },
    quantityContainer: {
        position: 'relative',
    },
    quantityOverlay: {
        width: 32,
        height: 32,
        left: 32,
        top: 0,
        position: 'absolute',
        background: 'rgba(160.30, 160.30, 160.30, 0.50)',
    },
    quantityText: {
        width: 7,
        height: 22,
        left: 44,
        top: 5,
        position: 'absolute',
        color: '#323232',
        fontSize: 18,
        fontFamily: 'Proxima Nova',
        fontWeight: 600,
        wordWrap: 'break-word',
    },
    quantityInput: {
        width: 50,
        margin: theme.spacing(0, 1),
    },
    addButton: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        background: 'rgba(255, 102, 0, 0.10)',
        borderRadius: 4,
        border: '1px #FF6600 solid',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        display: 'flex',
    },
    addText: {
        color: '#FF6600',
        fontSize: 18,
        fontFamily: 'Proxima Nova',
        fontWeight: 700,
        wordWrap: 'break-word',
    },
    // New styles for Card integration
    cardStyles: {
        width: 282,
        height: 374,
        position: 'relative',
    },
    categoryTitleArea: {
        textAlign: 'center',
        color: '#0D3823',
        fontSize: 16,
        fontFamily: 'Proxima Nova',
        fontWeight: 400,
        wordWrap: 'break-word',
    },
    categoryTitle: {
        fontSize: 16,
        fontFamily: 'Proxima Nova',
        fontWeight: 400,
        wordWrap: 'break-word',
    },
    cardItemIcons: {
        width: 32,
        height: 32,
        background: '#FFF',
        borderRadius: 4,
        border: '1px rgba(160, 160, 160, 0.5) solid',
    },
    cardItemTextField: {
        width: 32,
        height: '32 !imporatant',
        background: 'rgba(160.30, 160.30, 160.30, 0.5)',
    }
}));
