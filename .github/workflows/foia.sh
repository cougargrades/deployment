
az communication email send \
            --connection-string $ACS_CONNECTION_STRING \
            --sender "DoNotReply@cougargrades.io" \
            --to $MAIL_TO \
            --cc $MAIL_CC \
            --reply-to $MAIL_REPLY_TO \
            --subject $MAIL_SUBJECT \
            --text $MAIL_PLAINTEXT_BODY