#!/usr/bin/env ruby

require './spec/spec_helper'

describe 'My Feature' do
  before do
    @user = admin_session.create_test_user
    page.log_in_as(@user)
    page.create_document_set_from_csv('files/metadata-spec.csv')
    page.create_custom_view(name: 'Metadata', url: 'http://plugin-metadata')
  end

  after do
    admin_session.destroy_test_user(@user)
  end

  it 'should show document metadata' do
    page.find('h3', text: 'First', wait: WAIT_LOAD).click # wait for doclist to load

    page.within_frame('view-app-iframe') do
      # wait for plugin to load metadata
      value = page.find('tr[data-field-name="Foo"] input', wait: WAIT_LOAD).value
      assert_equal('Moo', value)
    end
  end
end
